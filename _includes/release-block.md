{% assign downloads = site.data.servers[include.branch] %}
{% for platform in page.platforms %}
   {%- assign platformId = platform[0] -%}
   {%- assign download = downloads[platformId] -%}
   {%- if download.url %}
   | {{ platform[1] }} | [{{ download.url | split: "/" | last }}]({{ download.url | replace: "http:", "https:" }}) | {{ download.size }} | {{ download.revision | date: "%B %d %Y %H:%M" }} |
   {%- endif -%}
{% endfor %}

{% if include.page[include.branch] %}
   {% assign branch = include.page[include.branch] %}
[Changelog](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Logitech/slimserver/{{ branch }}/Changelog{{ include.version | split: "." | first }}.html) -
[Git Commit Log](https://github.com/Logitech/slimserver/commits/{{ branch }})
{% else %}
   {% assign branch = include.branch | truncate: 3, '' %}
[Changelog](https://htmlpreview.github.io/?https://github.com/Logitech/slimserver/blob/public/{{ branch }}/Changelog{{ include.version | split: "." | first }}.html) -
[Git Commit Log](https://github.com/Logitech/slimserver/commits/public/{{ branch }})
{% endif %}
