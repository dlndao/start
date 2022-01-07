import {
  CasperClient,
  CLPublicKey,
  DeployUtil,
  Signer,
  Keys,
} from 'casper-js-sdk';

import { NATIVE_TRANSFER_PAYMENT_AMOUNT, RPC_API } from './constants';
export const buildTransferDeploy = ({
  networkName,
  fromAddrHex,
  toAddrHex,
  amount,
  id,
  ttl = 1800000,
}: {
  networkName: string; // obtained from chainspec
  fromAddrHex: string; // hex representation of senders public key (obtained from Signer)
  toAddrHex: string; // hex representation of receivers public key (from the form)
  amount: string; // amount of the transfer (from the form)
  id: string; // id to tag the transaction and to correlate it to your back-end storage (from the form)
  ttl: number; // time to live. default value is  30min
}) => {
  // create public keys from account-address (in fact it is hex representation of public-key with added prefix)
  const fromPublicKey = CLPublicKey.fromHex(fromAddrHex);
  const toPublicKey = CLPublicKey.fromHex(toAddrHex);

  // header
  const deployParams = new DeployUtil.DeployParams(
    fromPublicKey,
    networkName,
    ttl
  );

  // session
  const session = DeployUtil.ExecutableDeployItem.newTransfer(
    amount,
    toPublicKey,
    null, // optional: sourcePurse
    id
  );

  // for native transfers payment amount is fixed value stored in const.
  const payment = DeployUtil.standardPayment(NATIVE_TRANSFER_PAYMENT_AMOUNT);

  // deploy is created here
  const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

  // returning deploy in JSON format
  return DeployUtil.deployToJson(deploy);
};

export const sendConnectionRequest = async () =>
  await Signer.sendConnectionRequest();

export const getActivePublicKey = async () =>
  await Signer?.getActivePublicKey();

export const isConnected = async () => await Signer.isConnected();

export const sendTransferDeploy = (deployJson: any) => {
  // reconstructs deploy from JSON
  const deploy: any = DeployUtil.deployFromJson(deployJson);
  // init of client
  const client = new CasperClient(RPC_API);
  // putDeploy call which return deploy hash if succeded
  return client.putDeploy(deploy);
};

export { Keys };
