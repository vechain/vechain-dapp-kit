import {
    Button,
    VStack,
    Text,
    HStack,
    PinInput,
    PinInputField,
    Icon,
    useColorMode,
    ModalFooter,
    ModalBody,
    ModalHeader,
    ModalCloseButton,
    Container,
} from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';
import { ConnectModalContents } from './ConnectModal';
import { FadeInViewFromBottom, ModalBackButton } from '../common';
import React from 'react';

type Props = {
    email: string;
    code: string;
    onClose: () => void;
    setCode: (code: string) => void;
    onSubmit: () => void;
    onResend: () => void;
    isLoading: boolean;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContents>
    >;
};

export const EmailVerificationContent = ({
    email,
    code,
    setCode,
    onResend,
    isLoading,
    setCurrentContent,
}: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <FadeInViewFromBottom>
            <ModalHeader
                fontSize={'sm'}
                fontWeight={'200'}
                textAlign={'center'}
                color={isDark ? '#dfdfdd' : '#4d4d4d'}
                justifyContent={'center'}
                alignItems={'center'}
            >
                Enter confirmation code
            </ModalHeader>

            <ModalBackButton onClick={() => setCurrentContent('main')} />
            <ModalCloseButton />
            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={2}>
                        <Icon as={MdEmail} w="48px" h="48px" color="blue.500" />

                        <Text
                            fontSize="16px"
                            color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                            textAlign="center"
                        >
                            Please check {email} for an email
                            <br />
                            from privy.io and enter your code below.
                        </Text>
                        <HStack spacing={2} justify="center">
                            <PinInput
                                value={code}
                                onChange={setCode}
                                otp
                                size="lg"
                            >
                                <PinInputField
                                    borderRadius="12px"
                                    border={`1px solid ${
                                        isDark ? '#ffffff29' : '#ebebeb'
                                    }`}
                                    _hover={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff40' : '#e0e0e0'
                                        }`,
                                    }}
                                    _focus={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff60' : '#d0d0d0'
                                        }`,
                                        boxShadow: 'none',
                                    }}
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
                                    border={`1px solid ${
                                        isDark ? '#ffffff29' : '#ebebeb'
                                    }`}
                                    _hover={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff40' : '#e0e0e0'
                                        }`,
                                    }}
                                    _focus={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff60' : '#d0d0d0'
                                        }`,
                                        boxShadow: 'none',
                                    }}
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
                                    border={`1px solid ${
                                        isDark ? '#ffffff29' : '#ebebeb'
                                    }`}
                                    _hover={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff40' : '#e0e0e0'
                                        }`,
                                    }}
                                    _focus={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff60' : '#d0d0d0'
                                        }`,
                                        boxShadow: 'none',
                                    }}
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
                                    border={`1px solid ${
                                        isDark ? '#ffffff29' : '#ebebeb'
                                    }`}
                                    _hover={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff40' : '#e0e0e0'
                                        }`,
                                    }}
                                    _focus={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff60' : '#d0d0d0'
                                        }`,
                                        boxShadow: 'none',
                                    }}
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
                                    border={`1px solid ${
                                        isDark ? '#ffffff29' : '#ebebeb'
                                    }`}
                                    _hover={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff40' : '#e0e0e0'
                                        }`,
                                    }}
                                    _focus={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff60' : '#d0d0d0'
                                        }`,
                                        boxShadow: 'none',
                                    }}
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
                                    border={`1px solid ${
                                        isDark ? '#ffffff29' : '#ebebeb'
                                    }`}
                                    _hover={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff40' : '#e0e0e0'
                                        }`,
                                    }}
                                    _focus={{
                                        border: `1px solid ${
                                            isDark ? '#ffffff60' : '#d0d0d0'
                                        }`,
                                        boxShadow: 'none',
                                    }}
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                            </PinInput>
                        </HStack>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Text
                        w="100%"
                        textAlign="center"
                        fontSize="14px"
                        color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                    >
                        Didn't get an email?{' '}
                        <Button
                            variant="link"
                            color="blue.500"
                            fontSize="14px"
                            onClick={onResend}
                            isLoading={isLoading}
                        >
                            Resend code
                        </Button>
                    </Text>
                </ModalFooter>
            </Container>
        </FadeInViewFromBottom>
    );
};
