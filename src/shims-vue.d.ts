declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module '*.svg' {
  const svg: string;
  export default svg;
}
