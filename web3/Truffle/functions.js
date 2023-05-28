const Web3 = require("web3");
require("dotenv").config();

const fs = require("fs");
const { abi, bytecode } = JSON.parse(fs.readFileSync("./build/contracts/PawPrints.json"));
const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
const Tx = require('@ethereumjs/tx').Transaction;

async function deploy() {
  // Configuring the connection to an Ethereum node
  const network = process.env.ETHEREUM_NETWORK;
    // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);

  // Using the signing account to deploy the contract
  const contract = new web3.eth.Contract(abi);
  contract.options.data = bytecode;
  const deployTx = contract.deploy();
  const deployedContract = await deployTx
    .send({
      from: signer.address,
      gas: 5000000,
    })
    .once("transactionHash", (txhash) => {
      console.log(`Mining deployment transaction ...`);
    });
  // The contract is now deployed on chain!
  console.log(`Contract deployed at ${deployedContract.options.address}`);
  console.log(
    `Add DEMO_CONTRACT to the.env file to store the contract address: ${deployedContract.options.address}`
  );
}

async function CreateAccount(){
    var usr = web3.eth.accounts.create();
    console.log(usr);
}
// parameters ownerId, petId, billAmount, recordId, ownerAddress
async function CreateMedicalRecord(contractAddress, accountAddress, privateKey) {
    console.log("0");
    web3.eth.accounts.wallet.add(privateKey);
    var PawPrints = new web3.eth.Contract(abi, contractAddress);
    try {
    const receipt = await PawPrints.methods.newMedicalRecord(100, 101, 102, 103, '0x8e678e6E5Af6169de14E9bF145415Be95099f512').send({ from: accountAddress, gasLimit:500000});
    console.log('Transaction receipt:', receipt);
    } catch (error) {
    console.error('Error sending transaction:', error);
    }

   /*  console.log("1");
    var rawTx = {
        nonce: '0x00',
        gasPrice: '0x09184e72a000',
        gasLimit: '0x2710',
        from: accountAddress,
        value: '0x00',
        chainId: 80001,
        data: PawPrints.methods.newMedicalRecord(100, 101, 102, 103, '0x8e678e6E5Af6169de14E9bF145415Be95099f512').encodeABI(),
      }
    console.log("2");
    var tx = new Tx(rawTx, {'chain':'mumbai'});
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
    var signedTx = tx.sign(privateKeyBuffer);
    var stx = signedTx.serialize();
    console.log("4");
    web3.eth.sendSignedTransaction('0x' + stx.toString('hex')).on('receipt', console.log); */
}


async function ViewMedicalRecord(contractAddress){
    var PawPrints = new web3.eth.Contract(abi, contractAddress);
    
    var record = await PawPrints.methods.getMedicalRecord().call();
    console.log("Medical Record: ", record);
    return record;
}


//deploy();
//ViewMedicalRecord("0xa03d197a86D38BEb02724C4C36b02B74b00511cc");
//CreateMedicalRecord("0xa03d197a86D38BEb02724C4C36b02B74b00511cc","0x6854A7AE3Ed273e0e7C83d757b6d7F98BCcee8Fb","8a44399ff29f878fdfa6cd371f7a7e6655240c211ceea62ea0566fe7bc82dbfe");
ViewMedicalRecord("0xa03d197a86D38BEb02724C4C36b02B74b00511cc");
//ViewMedicalRecord("0x3614be9d07890ca45876df070de5fddfcb9b296b");
//CreateAccount();
