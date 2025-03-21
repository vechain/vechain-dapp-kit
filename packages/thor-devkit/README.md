# Thor DevKit

Typescript library to aid dApp development on VeChainThor.

[![NPM Version](https://badge.fury.io/js/thor-devkit.svg)](https://www.npmjs.com/package/thor-devkit)
[![Unit Test](https://github.com/vechain/thor-devkit.js/actions/workflows/test.yml/badge.svg)](https://github.com/vechain/thor-devkit.js/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/vechain/thor-devkit.js/badge.svg?branch=master)](https://coveralls.io/github/vechain/thor-devkit.js?branch=master)

## ⚠️ Repository Notice: End-of-Life (EOL)

**This repository is now archived and has reached its end-of-life (EOL).** We have transitioned to a new and improved repository that will continue to receive updates, support, and new features.

### Important Dates:
- **Final Version Release:** November 4th, 2024
- **End-of-Support Date:** December 31st, 2024
- **Repository Archive Date:** December 31st, 2024

### New Repository
You can start using the [VeChain SDK](https://github.com/vechain/vechain-sdk-js) for the latest updates and developments.

### Thank You
Thank you to all contributors and users for supporting this project. We appreciate your interest and encourage you to explore the new repository for ongoing improvements and features.

---

For any further questions or migration guidance, please reach out using our [support portal](https://support.vechain.org/support/home).

## Prerequisites

 - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
 - [Node.js](https://nodejs.org/en): minimum version is `18`.

## Installation

To install the library, run:

```bash
npm i thor-devkit
```

## Usage

### Transaction

To build and sign a transaction:

```javascript
import { Transaction, secp256k1 } from 'thor-devkit'

const clauses =  [{
    to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    value: 10000,
    data: '0x'
}]

// calc intrinsic gas
const gas = Transaction.intrinsicGas(clauses)
console.log(gas)
// 21000

let body: Transaction.Body = {
    chainTag: 0x9a,
    blockRef: '0x0000000000000000',
    expiration: 32,
    clauses: clauses,
    gasPriceCoef: 128,
    gas,
    dependsOn: null,
    nonce: 12345678
}

const tx = new Transaction(body)
const signingHash = tx.signingHash()
tx.signature = secp256k1.sign(signingHash, /* your private key */)

const raw = tx.encode()
const decoded = Transaction.decode(raw)
```

### Certificate

Client side self-signed certificate:

```javascript
import { Certificate, secp256k1, blake2b256 } from 'thor-devkit'

const cert: Certificate = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: 'fyi'
    },
    domain: 'localhost',
    timestamp: 1545035330,
    signer: <<<signer-address>>>
}

const jsonStr = Certificate.encode(cert)
const signature = secp256k1.sign(blake2b256(jsonStr), <<<private-key>>>)

cert.signature = '0x' + signature.toString('hex')

Certificate.verify(cert)

// certificate id
const id = '0x' + blake2b256(Certificate.encode(cert)).toString('hex')
```

### ABI

```javascript
import { abi } from 'thor-devkit'

const fn = new abi.Function({
    "constant": false,
    "inputs": [
        {
            "name": "a1",
            "type": "uint256"
        },
        {
            "name": "a2",
            "type": "string"
        }
    ],
    "name": "f1",
    "outputs": [
        {
            "name": "r1",
            "type": "address"
        },
        {
            "name": "r2",
            "type": "bytes"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
})

const data = fn.encode(1, 'foo')
```

### RLP

```javascript
import { RLP } from 'thor-devkit'

// define the profile for tx clause structure
const profile: RLP.Profile = {
    name: 'clause',
    kind: [
        { name: 'to', kind: new RLP.NullableFixedBlobKind(20) },
        { name: 'value', kind: new RLP.NumericKind(32) },
        { name: 'data', kind: new RLP.BlobKind() }
    ]
}

const clause = {
    to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    value: 10,
    data: '0x'
}

const rlp = new RLP(profile)

const data = rlp.encode(clause)
console.log(data.toString('hex'))
// d7947567d83b7b8d80addcb281a71d54fc7b3364ffed0a80

const obj = rlp.decode(data)
// `obj` should be identical to `clause`
```

### Crypto methods

#### Hash functions

```javascript
import { blake2b256, keccak256 } from 'thor-devkit'

const hash = blake2b256('hello world')
console.log(hash.toString('hex'))
// 256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610

hash = keccak256('hello world')
console.log(hash.toString('hex'))
// 47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad
```

#### Secp256k1

```javascript
import { secp256k1, keccak256, address } from 'thor-devkit'

const privKey = secp256k1.generatePrivateKey()
const pubKey = secp256k1.derivePublicKey(privKey)
const addr = address.fromPublicKey(pubKey)
const signature = secp256k1.sign(keccak256('hello world'), privKey)
const recoveredPubKey = secp256k1.recover(keccak256('hello world'), signature)
```

#### Mnemonic & Keystore

```javascript
import { mnemonic, Keystore, HDNode } from 'thor-devkit'

// generate BIP39 mnemonic words, default to 12 words(128bit strength)
const words = mnemonic.generate()

// derive private key from mnemonic words according to BIP32, using the path `m/44'/818'/0'/0`.
// defined for VET at https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const privateKey = mnemonic.derivePrivateKey(words)

// in recovery process, validation is recommended
let ok = mnemonic.validate(words)

// encrypt/decrypt private key using Ethereum's keystore scheme
const keystore = await Keystore.encrypt(privateKey, 'your password')

// throw for wrong password
const recoveredPrivateKey = await Keystore.decrypt(keystore, 'your password')

// roughly check keystore format
ok = Keystore.wellFormed(keystore)

// create BIP32 HD node from mnemonic words
const hdnode = HDNode.fromMnemonic(words)

// derive 5 child private keys
for (let i = 0; i < 5; i++) {
    let child = hdnode.derive(i)
    // get child private key
    // child.privateKey
}

// or create HD node from xpub
const pub = Buffer.from('04dc40b4324626eb393dbf77b6930e915dcca6297b42508adb743674a8ad5c69a046010f801a62cb945a6cb137a050cefaba0572429fc4afc57df825bfca2f219a', 'hex')
const chainCode = Buffer.from('105da5578eb3228655a8abe70bf4c317e525c7f7bb333634f5b7d1f70e111a33', 'hex')
hdnode = HDNode.fromPublicKey(pub, chainCode)
// derive 5 child public keys
for (let i = 0; i < 5; i++) {
    let child = hdnode.derive(i)
    // get child public key
    // child.publicKey
}
```


## License

Thor DevKit is licensed under the
[MIT License](https://github.com/vechain/thor-devkit.js/blob/master/LICENSE).
