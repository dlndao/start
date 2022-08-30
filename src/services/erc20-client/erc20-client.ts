import {
  CasperServiceByJsonRPC,
  CasperClient,
  DeployUtil,
  Keys,
  RuntimeArgs,
  CLValueBuilder,
  CLValue,
  CLPublicKey,
  Signer,
  CLTypeBuilder,
  CLString,
} from "casper-js-sdk";
import axios from "axios";

import * as utils from "./utils";
import { OWNER_PUBLIC_KEY, RPC_API, CHAIN_NAME } from "../constants";

class ERC20Client {
  private nodeAddress: string;
  private chainName: string;
  private ownerPublicKey: string;

  constructor() {
    this.nodeAddress = RPC_API;
    this.chainName = CHAIN_NAME;
    this.ownerPublicKey = OWNER_PUBLIC_KEY;
  }

  public async name(contractNamedKey: string) {
    const contractHash: string = await utils.getContractHash(contractNamedKey);
    const result = await contractSimpleGetter(this.nodeAddress, contractHash, [
      "name",
    ]);
    return result.value();
  }

  public async symbol(contractNamedKey: string) {
    const contractHash: string = await utils.getContractHash(contractNamedKey);
    const result = await contractSimpleGetter(this.nodeAddress, contractHash, [
      "symbol",
    ]);
    return result.value();
  }

  public async totalSupply(contractNamedKey: string) {
    const contractHash: string = await utils.getContractHash(contractNamedKey);
    const result = await contractSimpleGetter(this.nodeAddress, contractHash, [
      "total_supply",
    ]);
    return result.value().toString();
  }

  public async getTokenBalance(publicKey: string, contractNamedKey: string) {
    const contractHash: string = await utils.getContractHash(contractNamedKey);
    const accountHash = CLPublicKey.fromHex(publicKey).toAccountHashStr();

    let balanceKey: any;
    if (contractNamedKey === "ERC20_DLNG_STAKE_contract_hash") {
      balanceKey = [`balance-${publicKey}`];
    } else {
      balanceKey = [`balances_${accountHash.replace(/account-hash-/g, "")}`];
    }
    const result: any = await contractSimpleGetter(
      this.nodeAddress,
      contractHash,
      balanceKey
    ).catch((err) => {
      if (contractNamedKey === "ERC20_DLNG_STAKE_contract_hash") {
      }

      return { err };
    });

    return !result.err ? parseInt(result.data._hex, 16) : 0;
  }

  public async balanceOf(account: string, contractNamedKey: string) {
    const contractHash: string = await utils.getContractHash(contractNamedKey);
    const accountHash = CLPublicKey.fromHex(account).toAccountHashStr();
    const namedKeys: any = await getContractNamedKeys(contractHash);

    const result: any = await contractDictionaryGetter(
      this.nodeAddress,
      accountHash.replace(/account-hash-/g, ""),
      namedKeys.balances
    ).catch((err) => {
      return { err };
    });
    const maybeValue = !result.err ? result.value().unwrap() : 0;
    return maybeValue ? maybeValue.value().toString() : 0;
  }

  public async getStakeOf(publicKey: string, contractNamedKey: string) {
    const contractHash: string = await utils.getContractHash(contractNamedKey);
    const accountHash = CLPublicKey.fromHex(publicKey).toAccountHashStr();

    const result: any = await contractSimpleGetter(
      this.nodeAddress,
      contractHash,
      ["stake_of", accountHash.replace(/account-hash-/g, "")]
    ).catch((err) => {
      return { err };
    });

    return !result.err ? parseInt(result.data._hex, 16) : 0;
  }

  public async transfer(
    contractNamedKey: string,
    sender: string,
    recipient: string,
    amount: string,
    isSignerTransfer: boolean
  ) {
    const client = new CasperClient(this.nodeAddress);
    const mappedKeys = await mapOwnerKeys();
    const contractHash: string = await utils.getContractHash(contractNamedKey);

    // Get account-hash (Uint8Array) from public key
    const recipientAccountHash = CLValueBuilder.byteArray(
      CLPublicKey.fromHex(recipient).toAccountHash()
    );

    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: recipientAccountHash,
      amount: CLValueBuilder.u256(amount),
    });

    let deploy: any = await DeployUtil.makeDeploy(
      new DeployUtil.DeployParams(
        CLPublicKey.fromHex(sender),
        this.chainName,
        1,
        1800000
      ),
      DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        utils.contractHashToByteArray(contractHash),
        "transfer",
        runtimeArgs
      ),
      DeployUtil.standardPayment(3000000000)
    );

    let signedDeploy;

    if (isSignerTransfer) {
      deploy = await Signer.sign(
        DeployUtil.deployToJson(deploy),
        sender,
        recipient
      );
      const deployFromJson: any = DeployUtil.deployFromJson(deploy);
      signedDeploy = deployFromJson.val;
    } else {
      deploy = client.signDeploy(deploy, mappedKeys);
      signedDeploy = deploy;
    }

    // Dispatch deploy to node.
    const deployHash = await client.putDeploy(signedDeploy);

    if (deployHash !== null) {
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async addStakeholder(
    contractNamedKey: string,
    recipient: string,
    amount: any
  ) {
    const sender =
      "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203";
    const client = new CasperClient(this.nodeAddress);
    const mappedKeys = await mapOwnerKeys();
    const contractHash: string = await utils.getContractHash(contractNamedKey);

    const runtimeArgs = RuntimeArgs.fromMap({
      recipient: CLPublicKey.fromHex(recipient),
      amount: CLValueBuilder.u256(amount),
    });

    let deploy: any = await DeployUtil.makeDeploy(
      new DeployUtil.DeployParams(
        CLPublicKey.fromHex(sender),
        this.chainName,
        1,
        1800000
      ),
      DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        utils.contractHashToByteArray(contractHash),
        "add_stakeholder",
        runtimeArgs
      ),
      DeployUtil.standardPayment(3000000000)
    );

    let signedDeploy = client.signDeploy(deploy, mappedKeys);

    const deployHash = await client.putDeploy(signedDeploy);

    if (deployHash !== null) {
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async addProposal(
    contractNamedKey: string,
    proposal: object,
    proposal_id: string
  ) {
    const mappedProposal = new Map(Object.entries(proposal));
    const sender =
      "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203";
    const client = new CasperClient(this.nodeAddress);
    const mappedKeys = await mapOwnerKeys();
    const contractHash: string = await utils.getContractHash(contractNamedKey);

    const runtimeArgs = RuntimeArgs.fromMap({
      proposal_id: CLValueBuilder.string(proposal_id),
      proposal: toCLMap(mappedProposal),
    });

    let deploy: any = await DeployUtil.makeDeploy(
      new DeployUtil.DeployParams(
        CLPublicKey.fromHex(sender),
        this.chainName,
        1,
        1800000
      ),
      DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        utils.contractHashToByteArray(contractHash),
        "add_proposal",
        runtimeArgs
      ),
      DeployUtil.standardPayment(3000000000)
    );

    let signedDeploy = client.signDeploy(deploy, mappedKeys);

    const deployHash = await client.putDeploy(signedDeploy);

    if (deployHash !== null) {
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async getProposal(contractNamedKey: string, proposal_id: string) {
    const contractHash: string = await utils.getContractHash(contractNamedKey);
    const namedKeys: any = await getContractNamedKeys(contractHash);

    const result: any = await contractDictionaryGetter(
      this.nodeAddress,
      proposal_id,
      namedKeys.proposals
    ).catch((err) => {
      return { err };
    });

    const maybeValue = result.value().unwrap();
    const map: Array<[CLValue, CLValue]> = maybeValue.value();

    const jsMap: any = new Map();

    for (const [innerKey, value] of map) {
      jsMap.set(innerKey.value(), value.value());
    }
    let mapObj = Object.fromEntries(jsMap);

    return mapObj;
  }

  public async back(
    contractNamedKey: string,
    delegator: string,
    amount: string,
    proposal_id: string
  ) {
    const backerExist = await this.getBacker(contractNamedKey, proposal_id);
    const getProposal = await this.getProposal(contractNamedKey, proposal_id);

    //[proposal_id][token][delegator]: amount = > back
    const fundedAmount = backerExist
      ? backerExist.fundedAmount + amount
      : amount;
    getProposal["fundedAmount"] = fundedAmount;

    // const backingObj = `amount-${amount}`; = > then save funded amount to proposal
    // const backingObj = `delegator-${delegator},amount-${amount},fundedAmount-${fundedAmount}`;
    const mappedBacker = new Map(Object.entries({ amount }));

    // const mappedBacker = new Map(utils.parseTokenMeta(backingObj));
    const sender =
      "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203";

    const mappedKeys = await mapOwnerKeys();
    const contractHash: any = await utils.getContractHash(contractNamedKey);
    const token: any = utils.contractHashToByteArray(contractHash);

    const runtimeArgs = RuntimeArgs.fromMap({
      proposal_id: CLValueBuilder.string(proposal_id),
      token,
      delegator: CLValueBuilder.byteArray(
        CLPublicKey.fromHex(delegator).toAccountHash()
      ),
      backer: toCLMap(mappedBacker),
    });

    let deploy: any = await DeployUtil.makeDeploy(
      new DeployUtil.DeployParams(
        CLPublicKey.fromHex(sender),
        this.chainName,
        1,
        1800000
      ),
      DeployUtil.ExecutableDeployItem.newStoredContractByHash(
        utils.contractHashToByteArray(contractHash),
        "add_backer",
        runtimeArgs
      ),
      DeployUtil.standardPayment(3000000000)
    );

    const client = new CasperClient(this.nodeAddress);
    let signedDeploy = client.signDeploy(deploy, mappedKeys);
    const deployHash = await client.putDeploy(signedDeploy);

    if (deployHash !== null) {
      const saveFundedToProposal = await this.addProposal(
        contractNamedKey,
        getProposal,
        proposal_id
      );
      return deployHash;
    } else {
      throw Error("Invalid Deploy");
    }
  }

  public async getBacker(contractNamedKey: string, proposal_id: string) {
    const contractHash: string = await utils.getContractHash(contractNamedKey);
    const namedKeys: any = await getContractNamedKeys(contractHash);

    const result: any = await contractDictionaryGetter(
      this.nodeAddress,
      proposal_id,
      namedKeys.backers
    ).catch((err) => {
      return { err };
    });

    const maybeValue = result.err ? false : result?.value().unwrap();

    if (maybeValue) {
      const map: Array<[CLValue, CLValue]> = maybeValue?.value();
      const jsMap: any = new Map();

      for (const [innerKey, value] of map) {
        jsMap.set(innerKey.value(), value.value());
      }
      let mapObj = Object.fromEntries(jsMap);

      return mapObj;
    } else {
      return false;
    }
  }

  public async unBack(contractNamedKey: string, proposal_id: string) {
    const delegator: any = "";
    const backerExist: any = await this.getBacker(
      contractNamedKey,
      proposal_id
    );

    if (backerExist) {
      const sender =
        "01700bd2dc609faf7bbfb92dc8cb2a1e3f9fd2c5685f6fa94176fb9c175cd15203";

      const mappedKeys = await mapOwnerKeys();
      const contractHash: string = await utils.getContractHash(
        contractNamedKey
      );

      const runtimeArgs = RuntimeArgs.fromMap({
        proposal_id: CLValueBuilder.string(proposal_id),
      });

      let deploy: any = await DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(
          CLPublicKey.fromHex(sender),
          this.chainName,
          1,
          1800000
        ),
        DeployUtil.ExecutableDeployItem.newStoredContractByHash(
          utils.contractHashToByteArray(contractHash),
          "remove_backer",
          runtimeArgs
        ),
        DeployUtil.standardPayment(3000000000)
      );

      const client = new CasperClient(this.nodeAddress);
      let signedDeploy = client.signDeploy(deploy, mappedKeys);
      const deployHash = await client.putDeploy(signedDeploy);

      if (deployHash !== null) {
        const proposal: any = await this.getProposal(
          contractNamedKey,
          proposal_id
        );
        const rate = 0.03;
        const dlnRewards = (
          backerExist.amount *
          (rate / proposal.period)
        ).toString();

        const transferRewards = await this.transfer(
          "ERC20_DLN",
          sender,
          delegator,
          dlnRewards,
          true
        );
        return deployHash;
      } else {
        throw Error("Invalid Deploy");
      }
    } else {
      return false;
    }
  }
}

const mapOwnerKeys = async () => {
  const keys: any = await axios.get(
    "https://68dc7ezvig.execute-api.us-east-2.amazonaws.com/dev/getKeyPairOfContract"
  );
  const mappedKeys = Keys.Ed25519.parseKeyPair(
    Uint8Array.from(Object.values(keys.data.publicKey.data.data)),
    Uint8Array.from(Object.values(keys.data.privateKey.data))
  );

  return mappedKeys;
};

const contractSimpleGetter = async (
  nodeAddress: string,
  contractHash: string,
  key: string[]
) => {
  const stateRootHash = await utils.getStateRootHash(nodeAddress);

  const clValue = await utils.getContractData(
    nodeAddress,
    stateRootHash,
    contractHash,
    key
  );

  if (clValue && clValue.CLValue instanceof CLValue) {
    return clValue.CLValue!;
  } else {
    throw Error("Invalid stored value");
  }
};

const contractDictionaryGetter = async (
  nodeAddress: string,
  dictionaryItemKey: string,
  seedUref: string
) => {
  const stateRootHash = await utils.getStateRootHash(nodeAddress);

  const client = new CasperServiceByJsonRPC(nodeAddress);

  const storedValue = await client.getDictionaryItemByURef(
    stateRootHash,
    dictionaryItemKey,
    seedUref
  );

  if (storedValue && storedValue.CLValue instanceof CLValue) {
    return storedValue.CLValue!;
  } else {
    throw Error("Invalid stored value");
  }
};

const getContractNamedKeys = async (contractHash: string) => {
  const stateRootHash = await utils.getStateRootHash(RPC_API);
  const contractData = await utils.getContractData(
    RPC_API,
    stateRootHash,
    contractHash
  );

  let { namedKeys } = contractData.Contract!;
  const LIST_OF_NAMED_KEYS = [
    "balances",
    "stakes",
    "allowances",
    "decimals",
    "name",
    "symbol",
    "total_supply",
    "proposals",
    "backers",
  ];
  // @ts-ignore
  namedKeys = namedKeys.reduce((acc, val) => {
    if (LIST_OF_NAMED_KEYS.includes(val.name)) {
      return { ...acc, [utils.camelCased(val.name)]: val.key };
    }
    return acc;
  }, {});
  return namedKeys;
};

const toCLMap = (map: Map<string, string>) => {
  const clMap = CLValueBuilder?.map([
    CLTypeBuilder.string(),
    CLTypeBuilder.string(),
  ]);
  for (let [key, value] of Array.from(map.entries())) {
    key = key ? key : "";
    value = value ? value : "";
    clMap.set(CLValueBuilder.string(key), CLValueBuilder.string(value));
  }
  return clMap;
};

const fromCLMap = (map: Map<CLString, CLString>) => {
  const jsMap = new Map();
  for (const [key, value] of Array.from(map.entries())) {
    jsMap.set(key.value(), value.value());
  }
  return jsMap;
};

export default ERC20Client;
