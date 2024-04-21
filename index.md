---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

platforms:
   win: Windows Executable Installer
   win64: Windows 64-bit Installer - EXPERIMENTAL!
   osx: Apple macOS Installer
   debamd64: Debian Installer Package (x86_64)
   debarm: Debian Installer Package (ARM)
   debi386: Debian Installer Package (i386)
   deb: Debian Installer Package (i386, x86_64, ARM)
   rpm: RedHat (RPM) Installer Package
   tararm: ARM Linux Tarball
   src: Unix Tarball (i386, x86_64, i386 FreeBSD, ARM)
   nocpan: Unix Tarball - No CPAN Libraries
latest: 8.5.1
stable: 8.5.2
dev: 9.0.0
---

# {{ site.title }}

This is the community download site for the Lyrion Music Server / Logitech Media Server. If you have any questions or feedback,
don't hesitate to get in touch with the community over at the [Squeezebox Community Forums](https://forums.slimdevices.com/).
Or visit [https://lyrion.org](https://lyrion.org) to learn more about Lyrion Music Server and
Logitech Media Server.

If you're looking for the Docker image of Logitech Media Server, please head over to the [Docker Hub Page](https://hub.docker.com/r/lmscommunity/logitechmediaserver).

---
## ⭐️⭐️⭐️ {{ page.latest }} - Latest Release ⭐️⭐️⭐️

Use the `latest` release if you want to run the best tested version of Logitech Media Server.

{% include release-block.md branch="latest" page=page version=page.latest %}

---

## ⭐️⭐️ {{ page.stable }} - Stable Nightly Build ⭐️⭐️

The `stable` branch is `latest` with some additional bug fixes. Use this if you want to use a reliable system,
but need an important fix.

{% include release-block.md branch=page.stable page=page version=page.stable %}

---

## 💥⭐️💥 Lyrion Music Server {{ page.dev }} - Development Build 💥⭐️💥

The `dev` version is where you'll find all the latest and greatest features. And it comes with the new name
*Lyrion Music Server*. But as it's under development
you might encounter bugs, or changing behaviour. Please only use this build if you're willing to deal with
the occasional broken build!

**Please note that this version is undergoing major changes. Do _not_ install unless you are prepared to fix
your installation manually!**

{% include release-block.md branch=page.dev page=page version=page.dev %}

---