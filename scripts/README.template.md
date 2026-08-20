# {{name}}

{{description}}

## Installation

Install from [GitHub Releases](https://github.com/{{userRepo}}/releases/latest):

```
https://github.com/{{userRepo}}/releases/latest/download/userscript.user.js
```

## Configuration

Edit `meta.json` to configure your userscript metadata before your first release:

- **name** — display name shown in your userscript manager
- **version** — managed automatically by the version bump workflow
- **match** — URL patterns where the script runs (e.g. `https://example.com/*`)
- **grant** — GM APIs your script uses (e.g. `GM_setValue`, `GM_xmlhttpRequest`)

## Development

```bash
npm run dev          # Watch mode with sourcemaps
npm run build        # Production build
npm run type-check   # TypeScript type checking
npm test             # Run tests
npm run lint         # Lint src and test files
```

## Checking GM API Grants

Run `npm run check-grants` after adding any new `GM_*` or `GM.*` API calls. It scans your source files and warns if a grant is missing from `meta.json`, or if a declared grant is unused.

## CI/CD & Releases

1. Go to **Actions → Version Bump** and select patch, minor, or major
2. The workflow bumps `package.json` and `meta.json`, commits, and pushes a `v*` tag
3. The **Release** workflow triggers automatically, builds the userscript, and creates a GitHub Release with the artifact attached

> Make sure `templateMode` is set to `false` in `package.json` before your first release. If you ran `npm run setup`, this is already done.

## License

MIT