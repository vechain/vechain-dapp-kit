import { useEffect, useState } from 'react';

interface PrivyAppInfo {
    id: string;
    name: string;
    logo_url: string;
    icon_url: string | null;
    terms_and_conditions_url: string;
    privacy_policy_url: string;
    theme: string;
    accent_color: string;
    wallet_auth: boolean;
    email_auth: boolean;
    google_oauth: boolean;
    twitter_oauth: boolean;
    // Add other fields as needed
}

const fetchPrivyAppInfo = async (appId: string): Promise<PrivyAppInfo> => {
    const response = await fetch(`https://auth.privy.io/api/v1/apps/${appId}`, {
        headers: {
            'privy-app-id': appId,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch Privy app info');
    }

    return response.json();
};

export function useFetchAppInfo(appIds: string | string[]) {
    const [data, setData] = useState<Record<string, PrivyAppInfo> | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!appIds) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const ids = Array.isArray(appIds) ? appIds : [appIds];
                const results = await Promise.all(
                    ids.map((id) => fetchPrivyAppInfo(id)),
                );

                const appInfoMap = Object.fromEntries(
                    results.map((result, index) => [ids[index], result]),
                );

                setData(appInfoMap);
                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error ? err : new Error('Unknown error'),
                );
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [appIds]);

    return { data, error, isLoading };
}
