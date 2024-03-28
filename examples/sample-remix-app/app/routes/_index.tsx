import { lazy, Suspense } from 'react';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
    return [{ title: 'Remix' }];
};

const App = lazy(async () => {
    const module = await import('../.client/app.client');

    return { default: module.App };
});

export default function Index() {
    return (
        <Suspense fallback={<div>loading</div>}>
            {App ? <App /> : <div>content not loaded</div>}
        </Suspense>
    );
}
