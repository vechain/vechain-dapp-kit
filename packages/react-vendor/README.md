# React Vendor

## Usage

- Wrap a `ConnexVendorProvider` around your application:

```typescript jsx
export const SampleApp: React.FC = () => {

  // So that we can use the genesis ID
  const thor = new Connex.Thor({
    node: "https://mainnet.vechain.org/",
    network: "main",
  });

  return (
    <ConnexVendorProvider
      defaultWallet={{ source: "sync2" }}
      genesisId={thor.genesis.id}
    >
      <Account />
    </ConnexVendorProvider>
  );
};

```

- Selecting a wallet source

```typescript jsx
// https://docs.walletconnect.com/cloud/explorer#setting-up-a-new-project

const walletConnectProjectId = "yourProjectId";
const walletConnectMetadata = "yourMetadata";

const mobileWalletOptions: MobileWalletOptions = {
  projectId: "yourProjectId",
  metadata: {
    name: "My dApp",
    description: "My dApp description",
    url: window.location.origin,
    icons: [`${window.location.origin}/images/logo/my-dapp.png`],
  },
};

const SelectWallet: React.FC = (): JSX.Element => {
    const { setWallet, wallet } = useConnexVendor();

    const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      switch (value) {
        case "sync2":
        case "sync": {
          setWallet({ source: value });
          break;
        }
        case "veworld-extension": {
          // validate the extension is installed
          if (!window.vechain) return;
          setWallet({ source: value });
          break;
        }
        case "veworld-mobile": {
          // pass in the options for VeWorld Mobile
          setWallet({ source: value, options: mobileWalletOptions });
          break;
        }
      }
    };

    /**
     * TODO: Create a component to select the wallet
     * - you should disable veworld extension option if `window.vechain` is not defined
     */

    return (
      <div>
        <h2>Select a Wallet</h2>
        <form>
          {/*TODO: Create a component to select the wallet*/}
        </form>

        <p>Selected Wallet: {wallet.source}</p>
      </div>
    )
      ;
  }
;
```

- Vendor Usage:

```typescript jsx
const IdentifyUser: React.FC = (): JSX.Element => {
  const { vendor } = useConnexVendor();

  const [account, setAccount] = useState<string>();

  const requestSignCertificate = useCallback(
    async (msg: Connex.Vendor.CertMessage): Promise<string> => {
      const response = await vendor.sign("cert", msg).request();

      //TODO: Validate signature / signer

      return response.annex.signer;
    },
    [vendor]
  );

  const identifyUser = useCallback((): void => {
    requestSignCertificate({
      purpose: "identification",
      payload: {
        type: "text",
        content: "Hello, VeChain!",
      },
    })
      .then(setAccount)
      .catch((err) => {
        throw err;
      });
  }, [requestSignCertificate]);

  return (
    <>
      <button onClick={identifyUser} type="button">
        Identify
      </button>

      {account ? <p>Account: {account}</p> : null}
    </>
  );
};
```
