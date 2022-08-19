const config = require(process.env.NODE_ENV === 'production'
  ? './prod'
  : './dev');

export default config.default as IConfig;
