// pdfjs-dist ships types for its legacy build as `.d.mts`, which our TypeScript version cannot
// resolve. The legacy build has the same API as the default one, so reuse the package's types.
declare module 'pdfjs-dist/legacy/build/pdf.mjs' {
  export * from 'pdfjs-dist';
}

declare module 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url' {
  const workerSrc: string;
  export default workerSrc;
}
