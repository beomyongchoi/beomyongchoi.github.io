# Blog figures — terminal/mono house style

Terminal-window charts for blog posts (see `docs/blog-style.md` §4).
Shared `term.css` + one `t-*.html` per figure. Rendered to `public/assets/*.png`.

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --force-device-scale-factor=2 --hide-scrollbars \
  --window-size=1200,430 --screenshot=../../public/assets/ai-paradox-hero.png "file://$PWD/t-hero.html"
"$CHROME" --headless=new --disable-gpu --force-device-scale-factor=2 --hide-scrollbars \
  --window-size=1100,410 --screenshot=../../public/assets/ai-paradox-divergence.png "file://$PWD/t-divergence.html"
"$CHROME" --headless=new --disable-gpu --force-device-scale-factor=2 --hide-scrollbars \
  --window-size=1100,365 --screenshot=../../public/assets/ai-paradox-tools.png "file://$PWD/t-tools.html"
```

Terminal fills the PNG edge-to-edge (no outer frame). Chart text is English so ko/en posts share images.
