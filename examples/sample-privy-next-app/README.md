# `sample-privy-next-app`

This example demonstrates how to integrate the `@vechain/dapp-kit-react-privy` package into a Next.js application. It showcases how to leverage the library for seamless social login and VeChain ecosystem integration, providing a foundation for building robust and user-friendly decentralized applications (dApps).

## How it works

### Step 1: Dynamically Import the SocialLoginWrapper

To ensure compatibility with server-side rendering, dynamically import the SocialLoginWrapper component in layout.tsx:

```typescript
const SocialLoginWrapper = dynamic(
    async () =>
        (await import('./components/SocialLoginWrapper')).SocialLoginWrapper,
    {
        ssr: false,
    },
);

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <title>Privy Next JS</title>
            </head>
            <body>
                <SocialLoginWrapper>{children}</SocialLoginWrapper>
            </body>
        </html>
    );
}
```

### Step 2: Use Hooks and Components

Import the necessary hooks and components from @vechain/dapp-kit-react-privy and use them to interact with the VeChain ecosystem in your application:

```typescript
import { useVOT3Balance, useB3TRBalance } from '@vechain/dapp-kit-react-privy';

const b3trBalanceQuery = isConnected
    ? useB3TRBalance({ address: connectedAccount ?? '' })
    : useB3TRBalance({
          address: abstractedAccount.embeddedWallet?.address ?? '',
      });
const vot3BalanceQuery = isConnected
    ? useVOT3Balance({ address: connectedAccount ?? '' })
    : useVOT3Balance({
          address: abstractedAccount.embeddedWallet?.address ?? '',
      });
```
