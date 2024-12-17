import { useEffect, useState, useMemo } from 'react';

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

    // Memoize the IDs array to prevent unnecessary re-renders
    const normalizedIds = useMemo(() => {
        if (!appIds) return [];
        return Array.isArray(appIds) ? appIds : [appIds];
    }, [appIds]);

    useEffect(() => {
        if (!normalizedIds.length) return;

        let isMounted = true;

        const fetchData = async () => {
            if (!isMounted) return;
            setIsLoading(true);

            try {
                const results = await Promise.all(
                    normalizedIds.map((id) => fetchPrivyAppInfo(id)),
                );

                if (!isMounted) return;

                const appInfoMap = Object.fromEntries(
                    results.map((result, index) => [
                        normalizedIds[index],
                        result,
                    ]),
                );

                setData(appInfoMap);
                setError(null);
            } catch (err) {
                if (!isMounted) return;
                setError(
                    err instanceof Error ? err : new Error('Unknown error'),
                );
                setData(null);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [normalizedIds]); // Use memoized array as dependency

    return { data, error, isLoading };
}
