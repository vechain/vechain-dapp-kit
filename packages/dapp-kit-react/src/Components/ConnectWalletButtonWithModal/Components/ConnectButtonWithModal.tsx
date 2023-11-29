import { useContext, useMemo } from 'react';
import { ThemeContext } from '../../../provider/ThemeProvider';
import { createButtonWithModal } from './Wrapped/ConnectModalWithButtonWrapped';

export const ConnectButtonWithModal = () => {
    const { theme } = useContext(ThemeContext);

    const ModalWithButton = useMemo(() => createButtonWithModal(), []);

    return <ModalWithButton mode={theme.mode} />;
};
