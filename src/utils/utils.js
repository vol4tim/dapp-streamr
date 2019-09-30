import axios from 'axios';
import rosBag, { getRosbag } from './rosBag';
import config from '../config';
import getIpfs, { cat as ipfsCat } from '../RComponents/tools/ipfs';

export const genRosbagIpfs = data => {
  let bag;
  let hash;
  return getRosbag(data)
    .then(r => {
      bag = r;
      return getIpfs();
    })
    .then(ipfs => {
      return ipfs.add(bag);
    })
    .then(r => {
      hash = r[0].hash;
      return config.GATEWAY ? axios.get(`${config.GATEWAY}${hash}`) : null;
    })
    .then(() => {
      return hash;
    })
    .catch(e => {
      console.log(e);
    });
};
export const readRosbagIpfs = (hash, cb, topics = {}) => {
  return ipfsCat(hash).then(r => {
    return rosBag(new Blob([r]), cb, topics);
  });
};
