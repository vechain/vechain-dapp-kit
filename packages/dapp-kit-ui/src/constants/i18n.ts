export type TranslationKey =
    | 'connect-wallet'
    | 'copy-to-clipboard'
    | 'connected'
    | 'disconnect'
    | 'opening-veworld'
    | 'get-veworld';
export type Language = 'en' | 'it' | 'fr' | 'es' | 'de' | 'zh' | 'ja' | 'ru';

export type I18n = Record<Language, Record<TranslationKey, string>>;

export const defaultI18n: I18n = {
    en: {
        'connect-wallet': 'Connect Wallet',
        'copy-to-clipboard': 'Copy to Clipboard',
        connected: 'Connected',
        disconnect: 'Disconnect',
        'opening-veworld': 'Opening VeWorld...',
        'get-veworld': 'Get VeWorld',
    },
    it: {
        'connect-wallet': 'Connetti il Wallet',
        'copy-to-clipboard': 'Copia',
        connected: 'Connesso',
        disconnect: 'Disconnetti',
        'opening-veworld': 'Apertura di VeWorld...',
        'get-veworld': 'Ottieni VeWorld',
    },
    fr: {
        'connect-wallet': 'Connecter le portefeuille',
        'copy-to-clipboard': 'Copier dans le presse-papiers',
        connected: 'Connecté',
        disconnect: 'Déconnecter',
        'opening-veworld': 'Ouverture de VeWorld...',
        'get-veworld': 'Obtenir VeWorld',
    },
    es: {
        'connect-wallet': 'Conectar billetera',
        'copy-to-clipboard': 'Copiar al portapapeles',
        connected: 'Conectado',
        disconnect: 'Desconectar',
        'opening-veworld': 'Abriendo VeWorld...',
        'get-veworld': 'Obtener VeWorld',
    },
    de: {
        'connect-wallet': 'Wallet verbinden',
        'copy-to-clipboard': 'In Zwischenablage kopieren',
        connected: 'Verbunden',
        disconnect: 'Trennen',
        'opening-veworld': 'VeWorld wird geöffnet...',
        'get-veworld': 'VeWorld erhalten',
    },
    zh: {
        'connect-wallet': '连接钱包',
        'copy-to-clipboard': '复制到剪贴板',
        connected: '已连接',
        disconnect: '断开连接',
        'opening-veworld': '正在打开 VeWorld...',
        'get-veworld': '获取 VeWorld',
    },
    ja: {
        'connect-wallet': 'ウォレットに接続',
        'copy-to-clipboard': 'クリップボードにコピー',
        connected: '接続されました',
        disconnect: '切断する',
        'opening-veworld': 'VeWorld を開いています...',
        'get-veworld': 'VeWorld を取得',
    },
    ru: {
        'connect-wallet': 'Подключить кошелек',
        'copy-to-clipboard': 'Копировать в буфер обмена',
        connected: 'Подключено',
        disconnect: 'Отключить',
        'opening-veworld': 'Открытие VeWorld...',
        'get-veworld': 'Получить VeWorld',
    },
};
