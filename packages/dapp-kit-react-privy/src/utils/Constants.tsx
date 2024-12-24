import { ThorClient } from '@vechain/sdk-network';

/**
 * Network URL.
 * Defaults to mainnet.
 */
export const NETWORK_URL =
    process.env.NEXT_PUBLIC_NETWORK_URL ?? 'https://mainnet.vechain.org';

/**
 * Thor client instance
 */
export const THOR_CLIENT = ThorClient.at(NETWORK_URL);

/**
 * Delegator url for the account abstraction factory contract
 */
export const DELEGATOR_URL = process.env.NEXT_PUBLIC_DELEGATOR_URL as string;
import { SocialInfo } from './Types';

export const ACCOUNT_FACTORY_ADDRESSES = {
    '14018334920824264832118464179726739019961432051877733167310318607178':
        '0xC06Ad8573022e2BE416CA89DA47E8c592971679A',
    '1176455790972829965191905223412607679856028701100105089447013101863':
        '0x7EABA81B4F3741Ac381af7e025f3B6e0428F05Fb',
} as const;

export const EXPLORER_URL = {
    '14018334920824264832118464179726739019961432051877733167310318607178':
        'https://vechainstats.com/transaction',
    '1176455790972829965191905223412607679856028701100105089447013101863':
        'https://explore-testnet.vechain.org/transactions',
} as const;

export const VECHAIN_PRIVY_APP_ID = 'cm4wxxujb022fyujl7g0thb21';

export const WALLET_INFOS: SocialInfo[] = [
    {
        code: 'veworld',
        name: 'VeWorld',
        logo_url:
            'https://play-lh.googleusercontent.com/jqkMrElBCTKOhB85WdC70rg5ta0IsruE75nQLXRCiHD4GlsEX72_8aFohDYDrc9eG4BF',
    },
];

export const SOCIAL_INFOS: SocialInfo[] = [
    {
        code: 'twitter',
        name: 'Twitter',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/1024px-X_logo_2023.svg.png',
    },
    {
        code: 'google',
        name: 'Google',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png',
    },
    {
        code: 'apple',
        name: 'Apple',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/625px-Apple_logo_black.svg.png',
    },
    {
        code: 'instagram',
        name: 'Instagram',
        logo_url:
            'https://png.pngtree.com/element_our/sm/20180630/sm_5b37de3263964.jpg',
    },
    {
        code: 'linkedin',
        name: 'LinkedIn',
        logo_url:
            'https://image.similarpng.com/very-thumbnail/2020/07/Linkedin-logo-on-transparent-PNG-.png',
    },
    {
        code: 'tiktok',
        name: 'TikTok',
        logo_url:
            'https://w7.pngwing.com/pngs/959/454/png-transparent-tiktok-logo-thumbnail.png',
    },
    {
        code: 'spotify',
        name: 'Spotify',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/480px-Spotify_logo_without_text.svg.png',
    },
    {
        code: 'discord',
        name: 'Discord',
        logo_url:
            'https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
    },
    {
        code: 'github',
        name: 'GitHub',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/640px-Octicons-mark-github.svg.png',
    },
    {
        code: 'telegram',
        name: 'Telegram',
        logo_url:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/800px-Telegram_logo.svg.png',
    },
    {
        code: 'sms',
        name: 'SMS',
        logo_url:
            'https://w7.pngwing.com/pngs/356/440/png-transparent-iphone-computer-icons-telephone-email-telephone-electronics-text-mobile-phones.png',
    },
    {
        code: 'email',
        name: 'Email',
        logo_url:
            'https://cdn4.iconfinder.com/data/icons/social-media-logos-6/512/112-gmail_email_mail-512.png',
    },
];
