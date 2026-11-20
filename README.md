# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
## Quotes

Quotes live in two files, each exporting a `quoteList` array:

- `src/quotes/v1quotes.js` — the original set
- `src/quotes/v2quotes.js` — the newer set

Each quote is a three-item array, not an object. The text comes first. Two numbers follow it:

```js
["Have you slapped anyone?", 1, 0]
```

| Position | Meaning | Values |
| --- | --- | --- |
| 0 | Quote text | string |
| 1 | Favourite | `1` favourite, `0` not |
| 2 | NSFW | `1` NSFW, `0` not |

`src/utils/quotesManager.ts` loads both lists and turns each array into a quote with `text`, `isFavourite` (`quote[1] === 1`), `isNSFW` (`quote[2] === 1`), `source` (`"v1"` or `"v2"`), and an id such as `v1-12` or `v2-3`. The id is the list name plus the quote's index in that file.

The NSFW flag is what the "remove NSFW" setting filters on. The source is what the "exclude v1" setting filters on. The favourite flag is stored on the quote and is not used when picking the next quote.

A shown quote's id is saved in `localStorage` under `seen-quotes`, so it is not drawn again until the seen list is cleared.

## Credits

### Font
Credit to 'The Little Character Font Set' for the font, listen to this excellent podcast episode for the story of its history [podcast link](https://www.hyperfixedpod.com/listen/hyperfixed/little-by-little)
