import { useMemo } from 'react';
import { useThemeSelector } from '../../../provider/ThemeProvider';
import { createButtonWithModal } from './Wrapped/ConnectModalWithButtonWrapped';

export const ConnectButtonWithModal = () => {
    const { theme } = useThemeSelector();

    const ModalWithButton = useMemo(() => createButtonWithModal(), []);

    return <ModalWithButton mode={theme.mode} />;
};
