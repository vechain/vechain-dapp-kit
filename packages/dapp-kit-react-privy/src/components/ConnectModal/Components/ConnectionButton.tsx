import { Button, Icon, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { ReactElement } from 'react';

interface ConnectionButtonProps {
    isDark: boolean;
    onClick: () => void;
    text?: string;
    leftIcon?: ReactElement;
    icon?: IconType;
}

export const ConnectionButton = ({
    isDark,
    onClick,
    leftIcon,
    text,
    icon,
}: ConnectionButtonProps) => {
    if (!text && icon) {
        return (
            <Button
                variant={'loginIn'}
                fontSize={'14px'}
                fontWeight={'400'}
                backgroundColor={isDark ? 'transparent' : '#ffffff'}
                border={`1px solid ${isDark ? '#ffffff0a' : '#ebebeb'}`}
                p={6}
                borderRadius={16}
                w={'full'}
                onClick={onClick}
            >
                <Icon as={icon} w={'20px'} h={'20px'} />
            </Button>
        );
    }

    if (leftIcon) {
        return (
            <Button
                variant={'loginIn'}
                fontSize={'14px'}
                fontWeight={'400'}
                backgroundColor={isDark ? 'transparent' : '#ffffff'}
                border={`1px solid ${isDark ? '#ffffff0a' : '#ebebeb'}`}
                p={6}
                borderRadius={16}
                w={'full'}
                onClick={onClick}
                leftIcon={leftIcon}
            >
                {text && <Text>{text}</Text>}
            </Button>
        );
    }

    return null;
};
