# Resume PDF sources

Two downloadable résumé PDFs live in `public/`:

- `resume-beomyong-choi.pdf` — clean A4 (portrait), from `resume-clean.html`
- `resume-beomyong-choi-gameboy.pdf` — Game Boy–themed A4 (portrait, 8-bit "DEV BOY" LCD), from `resume-gameboy.html`

Self-contained HTML (inline CSS, no phone number). To regenerate after editing the HTML,
render with headless Chrome:

```sh
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=../../public/resume-beomyong-choi.pdf resume-clean.html

"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=../../public/resume-beomyong-choi-gameboy.pdf resume-gameboy.html
```

Page size / orientation is set via `@page { size: A4 [landscape] }` inside each file.
Keep the content in sync with `src/data/resume.ts`.
