export type I18n = Record<string, Record<string, string>>;

export const defaultI18n: I18n = {
    en: {
        'connect-wallet': 'Connect Wallet',
        'copy-to-clipboard': 'Copy to Clipboard',
        connected: 'Connected',
        disconnect: 'Disconnect',
        'opening-veworld': 'Opening VeWorld...',
        'get-veworld': 'Get VeWorld',
        'sign-connection-certificate-button': 'Sign Certificate',
        'sign-connection-certificate-description':
            'Proof address is required, please sign a certificate to continue',
        'waiting-signature': 'Waiting for signature...',
    },
    it: {
        'connect-wallet': 'Connetti il Wallet',
        'copy-to-clipboard': 'Copia',
        connected: 'Connesso',
        disconnect: 'Disconnetti',
        'opening-veworld': 'Apertura di VeWorld...',
        'get-veworld': 'Ottieni VeWorld',
        'sign-connection-certificate-button': 'Firma Certificato',
        'sign-connection-certificate-description':
            'È richiesta una firma di certificato per connettersi al wallet.',
        'waiting-signature': 'Attendo firma...',
    },
    fr: {
        'connect-wallet': 'Connecter le portefeuille',
        'copy-to-clipboard': 'Copier dans le presse-papiers',
        connected: 'Connecté',
        disconnect: 'Déconnecter',
        'opening-veworld': 'Ouverture de VeWorld...',
        'get-veworld': 'Obtenir VeWorld',
        'sign-connection-certificate-description':
            'Une signature de certificat est requise pour se connecter au portefeuille.',
        'sign-connection-certificate-button': 'Signer le certificat',
        'waiting-signature': 'En attente de la signature...',
    },
    es: {
        'connect-wallet': 'Conectar billetera',
        'copy-to-clipboard': 'Copiar al portapapeles',
        connected: 'Conectado',
        disconnect: 'Desconectar',
        'opening-veworld': 'Abriendo VeWorld...',
        'get-veworld': 'Obtener VeWorld',
        'sign-connection-certificate-description':
            'Se requiere una firma de certificado para conectarse a la billetera.',
        'sign-connection-certificate-button': 'Firmar certificado',
        'waiting-signature': 'Esperando firma...',
    },
    de: {
        'connect-wallet': 'Wallet verbinden',
        'copy-to-clipboard': 'In Zwischenablage kopieren',
        connected: 'Verbunden',
        disconnect: 'Trennen',
        'opening-veworld': 'VeWorld wird geöffnet...',
        'get-veworld': 'VeWorld erhalten',
        'sign-connection-certificate-description':
            'Eine Zertifikatssignatur ist erforderlich, um eine Verbindung zur Brieftasche herzustellen.',
        'sign-connection-certificate-button': 'Zertifikat signieren',
        'waiting-signature': 'Warte auf Signatur...',
    },
    zh: {
        'connect-wallet': '连接钱包',
        'copy-to-clipboard': '复制到剪贴板',
        connected: '已连接',
        disconnect: '断开连接',
        'opening-veworld': '正在打开 VeWorld...',
        'get-veworld': '获取 VeWorld',
        'sign-connection-certificate-description': '连接钱包需要签名证书。',
        'sign-connection-certificate-button': '签名证书',
        'waiting-signature': '等待签名...',
    },
    ja: {
        'connect-wallet': 'ウォレットに接続',
        'copy-to-clipboard': 'クリップボードにコピー',
        connected: '接続されました',
        disconnect: '切断する',
        'opening-veworld': 'VeWorld を開いています...',
        'get-veworld': 'VeWorld を取得',
        'sign-connection-certificate-description':
            'ウォレットに接続するには証明書の署名が必要です。',
        'sign-connection-certificate-button': '証明書に署名',
        'waiting-signature': '署名を待っています...',
    },
    ru: {
        'connect-wallet': 'Подключить кошелек',
        'copy-to-clipboard': 'Копировать в буфер обмена',
        connected: 'Подключено',
        disconnect: 'Отключить',
        'opening-veworld': 'Открытие VeWorld...',
        'get-veworld': 'Получить VeWorld',
        'sign-connection-certificate-description':
            'Для подключения к кошельку требуется подпись сертификата.',
        'sign-connection-certificate-button': 'Подписать сертификат',
        'waiting-signature': 'Ожидание подписи...',
    },
};
