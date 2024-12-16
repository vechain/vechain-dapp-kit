<div align="center">
    <h1><code>vechain-dapp-kit</code></h1>
    <p>
        <strong>A TypeScript library that facilitates seamless interaction between VeChain wallets.</strong>
    </p>
    <p>
        <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-dapp-kit"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-dapp-kit&metric=alert_status&token=69ceb851539382455c3eba073d1690bb58147af5" alt="Quality Gate Status"></a>
        <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-dapp-kit"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-dapp-kit&metric=security_rating&token=69ceb851539382455c3eba073d1690bb58147af5" alt="Security Rating"></a>
        <a href="https://sonarcloud.io/project/overview?id=vechain_vechain-dapp-kit"><img src="https://sonarcloud.io/api/project_badges/measure?project=vechain_vechain-dapp-kit&metric=sqale_rating&token=69ceb851539382455c3eba073d1690bb58147af5" alt="Maintainability Rating"></a>
        <a href="https://github.com/vechain/vechain-dapp-kit/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
    </p>
</div>

## Introduction

The VeChain DAppKit is a TypeScript library that facilitates seamless interaction between VeChain wallets (VeWorld, sync2)
and dApps, enhancing user experience and developer convenience. Please refer to [VeChain Docs](https://docs.vechain.org/developer-resources/sdks-and-providers/dapp-kit) for full documentation and usage.

## Table of Contents

-   [Why ?](#why-)
-   [Key features](#key-features)
-   [Contributing](#contributing)
-   [Sample Projects](#sample-projects)
-   [Branching Strategy](#branching-strategy)
-   [Setting up for local development](#setting-up-for-local-development)
    -   [Prerequisites](#prerequisites)
    -   [Install & build dependencies](#install--build-dependencies)
    -   [Run in Dev Mode](#run-in-dev-mode)
-   [Further Documentation & Usage](#further-documentation--usage)

## Why ?

-   Allow easy interaction with all wallets.
-   Currently, Connex only plays nice with Sync / Sync2
-   Enable a better UX for users

## Key features

1. **Wallet Connectivity**: Key components that handle interaction with VeWorld and Sync 2.

2. **Customizable UI**: Ability to totally customize the UI of components.

3. **User Experience**: Consistent experience with Ethereum and other chains.

4. **Developer friendly**: Easy to adopt with proper documentation.

---

## Contributing

Please refer to the [Contributing Guide](./CONTRIBUTING.md) for more information on how to contribute to the project.

---

## Sample Projects

https://github.com/vechain/vechain-dapp-kit/assets/150018882/5cc133ae-4c6b-4e08-8cff-0e09b6ca43aa

-   Look at some live demos here:
    -   [VueJs Demo](https://vechain.github.io/vechain-dapp-kit/vue/)
    -   [VanillaJS Demo](https://vechain.github.io/vechain-dapp-kit/vanilla/)
-   Refer to the [apps](./examples) folder for sample projects.

---

## Branching Strategy

Welcome to our project! Here's an overview of our branching strategy.

---

### Branch Types

-   **main**: The main branch represents the production-ready code. Only stable and tested features should be merged into
    this branch. Once ready for publishing, a new tag should be created from this branch.

---

## Setting up for local development

### Prerequisites

-   Node.js >= 18.17
-   Yarn >= 1.22.10

### Install & build dependencies

```bash
yarn install:all
```

### Run in Dev Mode

```bash
yarn dev
```

## Useful scripts

### Test

```bash
yarn test
```

### Clean project

```bash
yarn clean
```

### Purge project

-   Runs yarn clean and removes all node_modules

```bash
yarn purge
```

### Install yarn packages

```bash
yarn
```

### Build dependencies

```bash
yarn build:deps
```

### Build release

```bash
yarn build
```

---

### E2E Testing

We utilize Cucumber.js with Selenium for end-to-end (E2E) testing. To conduct these tests, you'll require the ChromeDriver. Here's how to install it:

**On Mac:**

```shell
brew install chromedriver
cd "$(dirname "$(which chromedriver)")"
xattr -d com.apple.quarantine chromedriver
```

Once installed, you can run tests in the browser using:

```bash
yarn test:e2e
```

Alternatively, you can run headless tests directly in the console using:

```bash
yarn test:e2e:headless
```

---

## Further Documentation & Usage

-   Please refer to [VeChain Docs](https://docs.vechain.org/developer-resources/sdks-and-providers) for more information
    on how to use the library.

---

## Publishing

```bash
# prepare the release, this will check out the release branch, install dependencies, build packages, test and update the package versions
yarn prepare:release X.Y.Z
```

Create the PR for the release branch `vX.Y.Z`.

When the PR is merged, create the release on github called `X.Y.Z`, it will automatically tag the commit with the version `X.Y.Z`.

```bash
# publish the release
yarn publish:release X.Y.Z
```
