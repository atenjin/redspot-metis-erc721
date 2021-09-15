import { patract, network } from "redspot";
import { hexToU8a } from '@polkadot/util';

const { getContractFactory } = patract;
const { createSigner, keyring, api } = network;

async function run() {
  await api.isReady;

  // The redspot signer supports passing in an address. If you want to use  substrate uri, you can do it like this:
  // const signer = createSigner(keyring.createFromUri("bottom drive obey lake curtain smoke basket hold race lonely fit walk//Alice"));
  // Or get the configured account from redspot config:
  // const signer = (await getSigners())[0]
  const signer = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"; // Alice Address
  const bob = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";

  const firstTokenId = hexToU8a('0x0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a');
  const secondTokenId = hexToU8a('0x0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b');
  const nonExistentTokenId = hexToU8a('0x0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c');

  const contractFactory = await getContractFactory("erc721", signer);
  const receiverFactory = await getContractFactory("receiver", signer);

  const balance = await api.query.system.account(signer);

  console.log("Balance: ", balance.toHuman());

  // The `deploy` method will attempt to deploy a new contract.
  // The `deployed` method will first find out if the same contract already exists based on the parameters.
  // If the contract exists, it will be returned, otherwise a new contract will be created.
  const contract = await contractFactory.deploy("new", "Kitty", "KIT", {
    gasLimit: "400000000000",
    value: "1000 UNIT",
  });

  console.log("");
  console.log(
    "Deploy erc721 successfully. The contract address: ",
    contract.address.toString()
  );


  const receiverContract = await receiverFactory.deploy("new");
  console.log("");
  console.log("Deploy receiver success, addr:", receiverContract.address.toString());


  console.log("mine token");
  await contract.tx.mint(signer, firstTokenId);
  await contract.tx.mint(signer, secondTokenId);
  await contract.tx.mint(signer, nonExistentTokenId);
  // // normal transfer
  // console.log("normal transfer");
  // var r = await contract.tx.transferFrom(signer, bob, firstTokenId);
  // console.log(r.events);
  // var r = await contract.tx.transferFrom(signer, receiverContract.address, secondTokenId);
  // console.log(r.events);

  // safe transfer
  console.log("safe transfer");
  var r = await contract.tx.safeTransferFrom(signer, bob, firstTokenId);
  console.log(r.events);
  var r = await contract.tx.safeTransferFrom(signer, receiverContract.address, secondTokenId);
  console.log(r.events);
  var r = await contract.tx.safeTransferFrom(signer, receiverContract.address, nonExistentTokenId);
  console.log(r.events);

  api.disconnect();
}

run().catch((err) => {
  console.log(err);
});
