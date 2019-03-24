const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { stringToU8a } = require('@polkadot/util');
const ALICE_SEED ='Alice'.padEnd(32, ' ');//'Aliceabf8e5bdbe30c65656c0a3cbd181ff8a56294a69dfedd27982aace4a76909115';
const BOB_ADDR = '5DuY2XTM3SpJyEQXTciqiav7SgnqGzoxkDbFJLpL9xNZj3zx';

async function main () {
    // Initialise the provider to connect to the local node
    const provider = new WsProvider('ws://127.0.0.1:9944');

    // Create the API and wait until ready
    const api = await ApiPromise.create(provider);

    // Retrieve the chain & node information information via rpc calls
    const [chain, nodeName, nodeVersion] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version()
    ]);

    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);

    // Create an instance of the keyring
    const keyring = new Keyring();

    // Add Alice to our keyring (with the known seed for the account)
    //const alice = keyring.addFromSeed(stringToU8a(ALICE_SEED));
    const alice = keyring.addFromUri("//Alice");
    // Instantiate the API
    //const api = await ApiPromise.create();
    //console.log(keyring.getPublicKeys() )
    // Create a extrinsic, transferring 12345 units to Bob
    const transfer = api.tx.balances.transfer(BOB_ADDR, 12345);

    // Sign and send the transaction using our account
    const hash = await transfer.signAndSend(alice);

    console.log('Transfer sent with hash', hash.toHex());
}

main()