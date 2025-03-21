# Connex Framework

[![npm version](https://badge.fury.io/js/%40vechain%2Fconnex-framework.svg)](https://badge.fury.io/js/%40vechain%2Fconnex-framework)

Connex Framework is a library implements Connex interface.

## Installation

It always works along with the package [@vechain/connex-driver](https://github.com/vechain/connex/tree/master/packages/driver).

```sh
npm i @vechain/connex-framework @vechain/connex-driver
```

## Usage


To create a Framework instance:

```typescript
import { Framework } from '@vechain/connex-framework'
import { Driver, SimpleNet } from '@vechain/connex-driver'

const net = new SimpleNet('http://localhost:8669/')
const driver = await Driver.connect(net)

// now we get the ready-to-use Connex instance object
const connex = new Framework(driver)
```

## License

This package is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.html), also included
in *LICENSE* file in the repository.
