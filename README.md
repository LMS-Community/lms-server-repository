## Logitech Media Server Repository

This repository handles the download links for Logitech Media Server. If you have an application which wants to check whether an update for Logitech Media Server was available, grab [`servers.json`](servers.json) to decide what you need.

* `latest`: this section gives you information about the latest _released_ version. It's the mainstream version which should be suitable to all without special requirements.

* `stable` is very close to `latest`, but provides some _bug fixes only_. It's built whenever there's a new change.

* `dev` is for the adventurous who wants to give the latest and greatest a try. New features are available here first. But due to it's development state it would often be less stable as the previous two branches, and might provide updates on a daily basis.

### Testing the build action

Testing the Github Action requires installation of [act](https://github.com/nektos/act).

Create a file `.secrets` with the following content:

```
GITHUB_TOKEN="ghp_****"
ACCESS_KEY_ID="A**********"
SECRET_ACCESS_KEY="************"
```

Where `GITHUB_TOKEN` is a Personal Access Token granting you permission to access this repository, and `ACCESS_KEY_ID` and `SECRET_ACCESS_KEY` are the credentials required to access `s3://downlaods.slimdevices.com`. You'll need at least read/write permissions on that bucket.

Then run the following command to test the action:

```
act --env DEBUG=1 --pull=false --secret-file=.secrets workflow_dispatch --container-architecture linux/amd64
```

With the `DEBUG` flag set you will get additional log output, and the file changes will not be pushed back to S3.

### Testing the page rendering

Rendering the pages is handled by Github using the [jekyll project](https://jekyllrb.com). See the [Github Pages Documentation](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll).

```
bundle exec jekyll serve
```
