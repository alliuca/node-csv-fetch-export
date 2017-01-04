let getEnvVar = (variable) => {
  return process.env[variable];
};

let getAPIResource = (method, query) => {
  return `?method=${method}&api_key=${config.LASTFM_API_KEY}${query}&format=json`
};

const config = {
  APP_SRC: __dirname + '/src',
  APP_DIST: __dirname + '/dist',
  APP_PORT: process.env.NODE_PORT || 3000,
  LASTFM_API_KEY: getEnvVar('LASTFM_API_KEY'),
  LASTFM_API_URL: `http://ws.audioscrobbler.com/2.0/`,
  getAPIResource
}

module.exports = config;