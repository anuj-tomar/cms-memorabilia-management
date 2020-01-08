const CONFIG = {
  'localhost:3000': {
    HOST: 'localhost:3000',
    //quorumqcapi
    API_BASE_PATH: 'http://thequorumqcapi.incred.io/api/',
  },
  'dev': {
    HOST: 'localhost:3001',
    API_BASE_PATH: 'http://quorumqcapi.kalakar.io/api/',
  },
  'quorum.kalakar.io': {
    HOST: 'quorum.kalakar.io',
    API_BASE_PATH: 'https://quorumapi.kalakar.io/api/',
  },
  'thequorum.incred.io': {
    HOST: 'thequorum.incred.io',
    API_BASE_PATH: 'https://thequorumapi.incred.io/api/',
  }
  
};

export function getHostConfig(key = '') {
  let host = window.location.host;
  let config = CONFIG[host] ? CONFIG[host] : CONFIG['dev'];
  return key ? config[key] : config;
}
