import axios from 'axios';

let ipfs = null;
export const init = config => {
  const start = (resolve, reject) => {
    ipfs = new Ipfs(config);
    ipfs.on('error', error => {
      console.log(error.message);
    });
    ipfs.once('ready', () =>
      ipfs.id((err, info) => {
        if (err) {
          return reject(err);
        }
        // eslint-disable-next-line no-console
        console.log('ipfs id ' + info.id);
        window.ipfs = ipfs;
        resolve(ipfs);
      })
    );
  };
  const check = (resolve, reject) => {
    start(resolve, reject);
  };
  if (document.readyState !== 'complete') {
    return new Promise((resolve, reject) => {
      window.addEventListener('load', () => {
        check(resolve, reject);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      check(resolve, reject);
    });
  }
};

export default () => {
  if (ipfs === null) {
    throw new Error('Ipfs not init');
  }
  return ipfs;
};

function pendingPromise() {
  return new Promise(() => {});
}
function killRejected(promise) {
  return promise.catch(pendingPromise);
}
function raceToSuccess(promises) {
  return Promise.race(promises.map(killRejected));
}
export const ipfsGateway = hash => {
  return axios
    .get(`https://ipfs.io/ipfs/${hash}`, {
      responseType: 'blob'
    })
    .then(r => r.data);
};
export const cat = hash => {
  const list = [ipfsGateway(hash)];
  if (ipfs.hasOwnProperty('cat')) {
    list.push(ipfs.cat(hash));
  } else if (ipfs.hasOwnProperty('files') && ipfs.files.hasOwnProperty('cat')) {
    list.push(ipfs.files.cat(hash));
  }
  return raceToSuccess(list);
};

const requestsIpns = new Set();
export const getDataByIpns = (hash, force = true) => {
  if (requestsIpns.has(hash) || force === false) {
    return Promise.resolve(false);
  }
  requestsIpns.add(hash);
  return axios
    .get(`https://ipfs.io/ipns/${hash}`)
    .then(r => {
      requestsIpns.delete(hash);
      return r.data;
    })
    .catch(() => {
      requestsIpns.delete(hash);
      return false;
    });
};
