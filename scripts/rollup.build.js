const { builds, getConfig } = require('./rollup.config.js');
module.exports = Object.keys(builds).map(getConfig);
module.a = 'a';