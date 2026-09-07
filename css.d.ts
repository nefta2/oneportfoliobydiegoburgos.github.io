// Next.js only ships declarations for CSS Modules (`*.module.css`), so plain
// side-effect imports like `import './navigation-bar.css'` have no type to
// resolve to. Declaring the wildcard here covers them; the more specific
// `*.module.css` declaration in `next/types/global.d.ts` still wins for modules.
declare module '*.css';
