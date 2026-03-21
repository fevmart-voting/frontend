import CryptoJS from 'crypto-js';

const SECRET = "c09a0bfc-6273-4c39-a2ad-5062888638c4";

export function genAuthString() {
  const voterId = CryptoJS.lib.WordArray.random(8).toString();
  const signature = CryptoJS.HmacSHA256(voterId, SECRET).toString();
  return `${voterId}.${signature}`;
}