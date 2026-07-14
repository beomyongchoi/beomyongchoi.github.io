## Blog house style (IMPORTANT — read before writing/editing posts)

See **`docs/blog-style.md`** for the writing rules (sentence style, Answer-first, callouts),
the terminal/mono chart style, and the bilingual sentence-click interaction. It encodes the
sentence-structure learnings from KaiCore AEO (`_prompt_style.py`, `body_writer.py`) + the imweb
blog reference. Follow it so posts stay consistent across sessions.

Key files: post content = `src/data/<slug>.ts` (sentence-aligned ko/en) rendered via
`src/components/BilingualArticle.astro`; post is a `.mdx` embedding that component. Chart sources
in `scripts/blog-figures/` → PNGs in `public/assets/`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
