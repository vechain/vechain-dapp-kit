import { useWallet } from '@vechain/dapp-kit-react';
import { Landing } from './screens/Landing';
import { Dashboard } from './screens/Dashboard';

function App() {
    const { account } = useWallet();

    if (account) {
        return <Dashboard />;
    }

    return <Landing />;
}

export default App;
