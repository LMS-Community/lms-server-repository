import * as path from 'path';
import dotenv  from "dotenv"
import { readFile, writeFile } from 'fs/promises';
import { S3Client, DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import jstoxml from 'jstoxml';
import { XMLParser } from 'fast-xml-parser';

const RELEASE_REVISION = 1732822968;
const RELEASE_VERSION = '9.0.0';
const STABLE_VERSION = '9.0.1';
const DEV_VERSION = '9.1.0';

const bucket = 'downloads';
const downloadUrl = 'downloads.lms-community.org';
const LATEST_FILE = 'latest.xml';
const STABLE_FILE = 'stable.xml';
const DEV_FILE = 'dev.xml';
const MAX_REVISIONS = 3;
let TESTING = false;

// in testing read secrets from file (unless defined already)
if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
	TESTING = true;
	dotenv.config({ path: path.resolve(process.cwd(), '.secrets') });
}

const client = new S3Client({
	region: 'us-east-1',
	endpoint: process.env.R2_ENDPOINT_URL,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	}
});

(async () => {
	// get latest release info
	if (RELEASE_REVISION)
		await createRepoFile(await getProdFilelist(), LATEST_FILE, RELEASE_REVISION);

	// remove old nightly builds etc.
	let { dev, stable } = await cleanupNightlies();
	if (dev.length < 1 && STABLE_VERSION === DEV_VERSION) dev = stable;

	// create XML for the nightlies
	await createRepoFile(stable, STABLE_FILE);
	await createRepoFile(dev, DEV_FILE);

	// create master repository file, based on individual XML files
	const parser = new XMLParser({
		ignoreAttributes : false,
		attributeNamePrefix : ''
	});

	const repos = {
		latest: (parser.parse(await readFile(LATEST_FILE))).servers
	};

	repos[DEV_VERSION] = (parser.parse(await readFile(DEV_FILE))).servers;
	repos[STABLE_VERSION] = (parser.parse(await readFile(STABLE_FILE))).servers;

	await writeFile('servers.json', JSON.stringify(repos));
})();

async function getProdFilelist() {
	let fileList;
	try {
		const response = await client.send(new ListObjectsV2Command({
			Bucket: bucket,
			Prefix: `LogitechMediaServer_v${RELEASE_VERSION}/`,
		}));

		fileList = response.Contents || [];
	}
	catch (err) {
		console.error(err);
	}

	if (fileList.length < 1) return;

	return fileList.map(file => {
		return {
			path: file.Key,
			size: file.Size
		};
	});
}

async function cleanupNightlies() {
	let fileList;
	try {
		const response = await client.send(new ListObjectsV2Command({
			Bucket: bucket,
			Prefix: 'nightly/',
		}));

		fileList = response.Contents || [];
	}
	catch (err) {
		console.error(err);
	}

	if (fileList.length < 1) return {};

	const versions = {
		obsolete: []
	};

	const response = {
		stable: [], dev: []
	};

	fileList.forEach(file => {
		const matches = file.Key.match(/(?:LyrionMusicServer|logitechmediaserver).(\d+\.\d\.\d).*(\d{10})/i);

		// put anything but dev/stable versions on the cleanup list
		if ( matches && matches.length === 3 && (matches[1] === STABLE_VERSION || matches[1] === DEV_VERSION) ) {
			const vs = versions[matches[1]] = versions[matches[1]] || {};
			vs[matches[2]] = vs[matches[2]] || [];
			vs[matches[2]].push({
				path: file.Key,
				size: file.Size
			});
		}
		else if ( !file.Key.match(/index\.(php|html)$/) ) {
			versions.obsolete.push(file);
		}
	});

	[DEV_VERSION, STABLE_VERSION].forEach(v => {
		if (!versions[v] || versions[v].length < 1) return;

		const vs = versions[v];

		// purge old revisions of dev/stable builds
		const obsolete = Object.keys(vs).sort().reverse().splice(MAX_REVISIONS);
		obsolete.forEach(r => {
			versions.obsolete.push(...vs[r]);
			delete vs[r];
		});

		// pick the latest revision of the current version
		const r = Object.keys(vs).sort().pop();
		response[v === STABLE_VERSION ? 'stable' : 'dev'] = vs[r];
	});

	if (TESTING)
		console.log(JSON.stringify(versions, null, 2));

	// remove obsolete objects
	if (versions.obsolete.length && !TESTING) {
		try {
			await client.send(new DeleteObjectsCommand({
				Bucket: bucket,
				Delete: {
					Objects: versions.obsolete.map(file => { return { Key: file.path || file.Key } })
				}
			}))
		}
		catch (err) {
			console.error(err);
		}
	}

	return response;
}

async function createRepoFile(files, filename, revision) {
	if (!files || files.length < 1) return;

	let matcher = revision
		? path => path.match(/(?:LyrionMusicServer|logitechmediaserver).(\d+\.\d\.\d).*/i)
		: path => path.match(/(?:LyrionMusicServer|logitechmediaserver).(\d+\.\d\.\d).*(\d{10})/i);

	try {
		const repo = [];

		// sort items by URL to always have them in the same order and prevent unnecessary repo update commits
		files.sort(fileSorter).forEach(release => {
			if (!(release && release.path && release.size))
				return;

			const platform = getPlatform(release.path);
			const matches = matcher(release.path);
			if (platform && matches) {
				repo.push({
					_name: platform,
					_attrs: {
						url: 'https://' + downloadUrl + '/' + release.path,
						version: matches[1],
						revision: matches[2] || revision,
						size: prettySize(release.size)
					}
				});
			}
		});

		// migrate macOS PrefPane users to using the MenuBar item:
		// if a new "macos" item exists, replace legacy "osx" with the former
		const macOS = repo.find(i => i._name === 'macos')
		if (macOS) {
			let hasOSX = true;

			// see whether a legacy builds exists - replace if yes
			const osx = repo.find(i => i._name === 'osx') || (() => {
				hasOSX = false;
				return {
					_name: 'osx',
					_attrs: {}
				};
			})();

			osx._attrs = { ...macOS._attrs };

			// legacy build did not exist - add it
			if (!hasOSX) repo.push(osx);
		}

		await writeFile(filename, jstoxml.toXML({ servers: repo }));
	} catch (err) {
		console.error(err);
	}
}

function fileSorter(a, b) {
	if (a.path < b.path) return -1;
	else if (a.path > b.path) return 1;
	return 0;
}

function prettySize(bytes) {
	const size = parseInt(bytes) / 1024;

	if (size < 1024) {
		return parseInt(size) + ' KB';
	}
	else if (size / 1024 < 1024) {
		return parseInt(size / 1024) + ' MB';
	}
	else if (size / 1024 / 1024 < 1024) {
		return parseInt(size / 1024 / 1024) + ' GB';
	}

	return size;
}

function getPlatform(file) {
	if (file.match(/win64\.exe$/))          return 'win64';
	else if (file.match(/\.exe$/))          return 'win';
	else if (file.match(/\.rpm$/))          return 'rpm';
	else if (file.match(/_amd64\.deb$/))    return 'debamd64';
	else if (file.match(/_arm\.deb$/))      return 'debarm';
	else if (file.match(/_i386\.deb$/))     return 'debi386';
	else if (file.match(/_all\.deb$/))      return 'deb';
	else if (file.match(/noCPAN\.tgz$/))    return 'nocpan';
	else if (file.match(/arm-linux\.tgz$/)) return 'tararm';
	else if (file.match(/MusicalFidelity\.tgz$/)) return 'encore';
	else if (file.match(/\.tgz$/))          return 'src';
	else if (file.match(/\.pkg$/))          return 'osx';
	else if (file.match(/\.dmg$/))          return 'macos';
	// else if (file.match(/macOS\.zip$/))     return 'macos';
}