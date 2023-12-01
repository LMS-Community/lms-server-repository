{% for download in site.data.servers[include.branch] %}
   {%- if download[0] != 'default' and download[0] != 'whs' -%}
   {% assign platform = download[0] %}
   | {{ page.platforms[platform] }} | [{{ download[1].url | split: "/" | last }}]({{ download[1].url }}) | {{ download[1].size }} | {{ download[1].revision | date: "%B %d %Y %H:%M" }} |
   {%- endif -%}
{% endfor %}

{% if include.page[include.branch] %}
   {% assign branch = include.page[include.branch] %}
[Changelog](http://htmlpreview.github.io/?https://raw.githubusercontent.com/Logitech/slimserver/{{ branch }}/Changelog8.html) -
[Git Commit Log](https://github.com/Logitech/slimserver/commits/{{ branch }})
{% else %}
   {% assign branch = include.branch | truncate: 3, '' %}
[Changelog](http://htmlpreview.github.io/?https://github.com/Logitech/slimserver/blob/public/{{ branch }}/Changelog8.html) -
[Git Commit Log](https://github.com/Logitech/slimserver/commits/public/{{ branch }})
{% endif %}
