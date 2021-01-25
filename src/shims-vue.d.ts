declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module '*.svg' {
  const svg: string;
  export default svg;
}

declare module '*.scss' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variables: any;
  export = variables;
}
