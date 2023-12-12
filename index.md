---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

platforms:
   win: Windows Executable Installer
   win64: Windows 64-bit Executable Installer - EXPERIMENTAL!
   osx: Mac OSX Installer
   src: Unix Tarball (i386, x86_64, i386 FreeBSD, ARM EABI)
   tararm: ARM Linux Tarball (ARM EABI)
   nocpan: Unix Tarball - No CPAN Libraries
   deb: Debian Installer Package (i386, x86_64, ARM EABI)
   debamd64: Debian Installer Package (x86_64)
   debarm: Debian Installer Package (ARM)
   debi386: Debian Installer Package (i386)
   rpm: RedHat (RPM) Installer Package
latest: 8.3.1
stable: 8.3.2
dev: 8.4.0
---

# {{ site.title }}

This is the community download site for the Logitech Media Server. If you have any questions or feedback,
don't hesitate to get in touch with the community over over at the [Squeezebox Community Forums](https://forums.slimdevices.com/).

---
## Latest Release - {{ page.latest }}

Use the `latest` release if you want to run the best tested version of Logitech Media Server.

{% include release-block.md branch="latest" page=page %}

---

## Stable Nightly Build - {{ page.stable }}

The `stable` branch is `latest` with some additional bug fixes. Use this if you want to use a reliable system,
but need an important fix.

{% include release-block.md branch=page.stable page=page %}

---

## Development Build - {{ page.dev }}

The `dev` version is where you'll find all the latest and greatest features. But as it's under development
you might encounter bugs, or changing behaviour. Please only use this build if you're willing to deal with
the occasional broken build!

{% include release-block.md branch=page.dev page=page %}

---