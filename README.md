## Logitech Media Server Repository

This repository handles the download links for Logitech Media Server. If you have an application which wants to check whether an update for Logitech Media Server was available, grab [`servers.json`](servers.json) to decide what you need.

* `latest`: this section gives you information about the latest _released_ version. It's the mainstream version which should be suitable to all without special requirements.

* `stable` is very close to `latest`, but provides some _bug fixes only_. It's built whenever there's a new change.

* `dev` is for the adventurous who wants to give the latest and greatest a try. New features are available here first. But due to it's development state it would often be less stable as the previous two branches, and might provide updates on a daily basis.

### Testing the build action

Testing the Github Action requires installation of [act](https://github.com/nektos/act).

```
act --env DEBUG=1 --pull=false --secret-file=.secrets workflow_dispatch --container-architecture linux/amd64
```

### Testing the page rendering

Rendering the pages is handled by Github using the [jekyll project](https://jekyllrb.com). See the [Github Pages Documentation](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll).

```
bundle exec jekyll serve
```
