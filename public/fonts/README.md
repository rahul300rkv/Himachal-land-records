# Priestacy webfont

Priestacy is a commercial typeface by Sronstudio. Its free/demo files are licensed for personal use only.

To activate Priestacy on the production website:

1. Purchase a webfont license from the typeface publisher.
2. Export or obtain the licensed `Priestacy.woff2` webfont file.
3. Place it in this directory as `Priestacy.woff2`.
4. Update the `@font-face` source in `src/styles/fonts.css` to:

   `src: url('/fonts/Priestacy.woff2') format('woff2'), local('Priestacy');`

Until then, the site uses the open-licensed Allura signature font as its visual fallback.
