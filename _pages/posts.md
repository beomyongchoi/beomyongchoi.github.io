---
layout: default
title: Posts
permalink: /posts/
---
{% for post in site.posts %}
  <article>
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: site.theme_config.date_format }}</time>
    {{ post.excerpt }}
  </article>
{% endfor %}