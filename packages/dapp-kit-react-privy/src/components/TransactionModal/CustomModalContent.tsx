import { ModalContent, ModalContentProps, Show } from '@chakra-ui/react';

export const CustomModalContent = ({
    children,
    ...others
}: ModalContentProps) => {
    return (
        <>
            <Show below="sm">
                <ModalContent
                    position="fixed"
                    bottom="0px"
                    mb="0"
                    roundedTop={'20px'}
                    roundedBottom="0"
                    {...others}
                >
                    {children}
                </ModalContent>
            </Show>
            <Show above="sm">
                <ModalContent rounded={'20px'} {...others}>
                    {children}
                </ModalContent>
            </Show>
        </>
    );
};
