# vechain-dapp-kit

VeWorld WalletKit is a typescript library that facilitates seamless interaction between VeChain wallets (veworld, sync2)
and dApps, enhancing user experience and developer convenience.

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
-   Currently, connex only plays nice with Sync / Sync2
-   Enable a better UX for users

## Key features

Key Features a.k.a scope

1. wallet connectivity

    key components that handle interaction with veworld and sync 2

2. customizable UI

    ability to totally customize the UI of components

3. User Experience

    Consistent experience with Ethereum and other chains

4. Developer friendly

    Easy to adopt with proper documentation.

---

## Contributing

-   Please refer to the [Contributing Guide](./CONTRIBUTING.md) for more information on how to contribute to the project.

---

## Sample Projects

-   Please refer to the [apps](./apps) folder for sample projects.

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

## Further Documentation & Usage

-   Please refer to [Vechain Docs](https://docs.vechain.org/developer-resources/sdks-and-providers) for more information
    on how to use the library.
