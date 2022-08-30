import { CasperServiceByJsonRPC, Keys, CLPublicKey } from 'casper-js-sdk';
import fs from 'fs';
import { OWNER_PUBLIC_KEY, RPC_API } from '../constants';

export const camelCased = (myString: string) =>
  myString.replace(/_([a-z])/g, (g) => g[1].toUpperCase());

export const parseTokenMeta = (str: string): Array<[string, string]> =>
  str?.split(',').map((s) => {
    const map = s.split('-');
    return [map[0], map[1]];
  });

export const parseMap = (mapArray: object): any => Object.entries(mapArray);

/**
 * Returns an ECC key pair mapped to an NCTL faucet account.
 * @param pathToFaucet - Path to NCTL faucet directory.
 */

export const getKeyPairOfContract = (pathToFaucet: string) =>
  Keys.Ed25519.parseKeyFiles(
    `${pathToFaucet}/public_key.pem`,
    `${pathToFaucet}/secret_key.pem`
  );

/**
 * Returns a binary as u8 array.
 * @param pathToBinary - Path to binary file to be loaded into memory.
 * @return Uint8Array Byte array.
 */
export const getBinary = (pathToBinary: string) => {
  return new Uint8Array(fs.readFileSync(pathToBinary, null).buffer);
};

/**
 * Returns global state root hash at current block.
 * @param {Object} client - JS SDK client for interacting with a node.
 * @return {String} Root hash of global state at most recent block.
 */
export const getStateRootHash = async (nodeAddress: string) => {
  const client = new CasperServiceByJsonRPC(nodeAddress);
  const { block } = await client.getLatestBlockInfo();
  if (block) {
    return block.header.state_root_hash;
  } else {
    throw Error('Problem when calling getLatestBlockInfo');
  }
};

export const getAccountInfo = async (nodeAddress: string, publicKey: any) => {
  let stateRootHash = await getStateRootHash(nodeAddress);
  const client = new CasperServiceByJsonRPC(nodeAddress);
  const accountHash = CLPublicKey.fromHex(publicKey).toAccountHashStr();
  const blockState = await client.getBlockState(stateRootHash, accountHash, []);
  return blockState.Account;
};

/**
 * Returns a value under an on-chain account's storage.
 * @param accountInfo - On-chain account's info.
 * @param namedKey - A named key associated with an on-chain account.
 */
export const getContractHash = async (namedKey: string) => {
  const accountInfo: any = await getAccountInfo(RPC_API, OWNER_PUBLIC_KEY);

  const accountHash = accountInfo.namedKeys.find(
    (i: any) => i.name === namedKey
  );
  if (accountHash) {
    return accountHash.key.replace(/hash-/g, '');
  }
};

export const getContractData = async (
  nodeAddress: string,
  stateRootHash: string,
  contractHash: string,
  path: string[] = []
) => {
  const client = new CasperServiceByJsonRPC(nodeAddress);
  const blockState = await client.getBlockState(
    stateRootHash,
    `hash-${contractHash}`,
    path
  );
  return blockState;
};

export const contractHashToByteArray = (contractHash: string) =>
  Uint8Array.from(Buffer.from(contractHash, 'hex'));

export const sleep = (num: number) => {
  return new Promise((resolve) => setTimeout(resolve, num));
};
