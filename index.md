---
layout: default
title: 홈
---

<h2>게시글 목록</h2>
<ul>
  {% for post in site.posts %}
    <li>
      <h3>
        <a href="{{ post.url | relative_url }}">
          {{ post.title | escape }}
        </a>
      </h3>
      <p>{{ post.excerpt }}</p>
      <span>{{ post.date | date: "%Y년 %m월 %d일" }}</span>
    </li>
  {% endfor %}
</ul>
