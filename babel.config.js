module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: [
    // Hack to replace import.meta by process.env
    // https://github.com/vitejs/vite/issues/1149#issuecomment-775033930
    () => ({
      visitor: {
        MetaProperty(path) {
          path.replaceWithSourceString('process');
        },
      },
    }),
  ],
};
