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
    Modal,
    ModalContent,
    ModalOverlay,
    useMediaQuery,
} from '@chakra-ui/react';
import { MdEmail } from 'react-icons/md';
import { FadeInViewFromBottom } from '../common';
import { useEffect, useState } from 'react';
import { useLoginWithEmail } from '@privy-io/react-auth';

type Props = {
    email: string;
    onResend: () => void;
    isLoading: boolean;
    isOpen: boolean;
    onClose: () => void;
};

export const EmailCodeVerificationModal = ({
    email,
    onResend,
    isLoading,
    isOpen,
    onClose,
}: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { loginWithCode } = useLoginWithEmail({});

    useEffect(() => {
        if (code.length === 6) {
            loginWithCode({ code })
                .then(() => {
                    onClose();
                })
                .catch((error) => {
                    setError(error.message);
                });
        }
    }, [code]);

    return (
        <Modal
            motionPreset={isDesktop ? 'none' : 'slideInBottom'}
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size={'sm'}
            trapFocus={false}
        >
            <ModalOverlay />
            <ModalContent>
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

                    {/* <ModalBackButton
                        onClick={() => setCurrentContent('main')}
                    /> */}
                    <ModalCloseButton />
                    <Container maxW={'container.lg'}>
                        <ModalBody>
                            <VStack spacing={2}>
                                <Icon
                                    as={MdEmail}
                                    w="48px"
                                    h="48px"
                                    color={
                                        isDark ? 'whiteAlpha.700' : 'gray.600'
                                    }
                                />

                                <Text
                                    fontSize="xs"
                                    color={
                                        isDark ? 'whiteAlpha.700' : 'gray.600'
                                    }
                                    textAlign="center"
                                >
                                    Please check {email} for an email from
                                    privy.io and enter your code below.
                                </Text>
                                <HStack spacing={2} justify="center" mt={4}>
                                    <PinInput
                                        value={code}
                                        onChange={setCode}
                                        otp
                                        size="lg"
                                        isInvalid={!!error}
                                        errorBorderColor="red.500"
                                    >
                                        <PinInputField
                                            borderRadius="12px"
                                            border={`1px solid ${
                                                isDark ? '#ffffff29' : '#ebebeb'
                                            }`}
                                            _hover={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff40'
                                                        : '#e0e0e0'
                                                }`,
                                            }}
                                            _focus={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff60'
                                                        : '#d0d0d0'
                                                }`,
                                                boxShadow: 'none',
                                            }}
                                            backgroundColor={
                                                isDark
                                                    ? 'transparent'
                                                    : '#ffffff'
                                            }
                                        />
                                        <PinInputField
                                            borderRadius="12px"
                                            border={`1px solid ${
                                                isDark ? '#ffffff29' : '#ebebeb'
                                            }`}
                                            _hover={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff40'
                                                        : '#e0e0e0'
                                                }`,
                                            }}
                                            _focus={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff60'
                                                        : '#d0d0d0'
                                                }`,
                                                boxShadow: 'none',
                                            }}
                                            backgroundColor={
                                                isDark
                                                    ? 'transparent'
                                                    : '#ffffff'
                                            }
                                        />
                                        <PinInputField
                                            borderRadius="12px"
                                            border={`1px solid ${
                                                isDark ? '#ffffff29' : '#ebebeb'
                                            }`}
                                            _hover={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff40'
                                                        : '#e0e0e0'
                                                }`,
                                            }}
                                            _focus={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff60'
                                                        : '#d0d0d0'
                                                }`,
                                                boxShadow: 'none',
                                            }}
                                            backgroundColor={
                                                isDark
                                                    ? 'transparent'
                                                    : '#ffffff'
                                            }
                                        />
                                        <PinInputField
                                            borderRadius="12px"
                                            border={`1px solid ${
                                                isDark ? '#ffffff29' : '#ebebeb'
                                            }`}
                                            _hover={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff40'
                                                        : '#e0e0e0'
                                                }`,
                                            }}
                                            _focus={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff60'
                                                        : '#d0d0d0'
                                                }`,
                                                boxShadow: 'none',
                                            }}
                                            backgroundColor={
                                                isDark
                                                    ? 'transparent'
                                                    : '#ffffff'
                                            }
                                        />
                                        <PinInputField
                                            borderRadius="12px"
                                            border={`1px solid ${
                                                isDark ? '#ffffff29' : '#ebebeb'
                                            }`}
                                            _hover={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff40'
                                                        : '#e0e0e0'
                                                }`,
                                            }}
                                            _focus={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff60'
                                                        : '#d0d0d0'
                                                }`,
                                                boxShadow: 'none',
                                            }}
                                            backgroundColor={
                                                isDark
                                                    ? 'transparent'
                                                    : '#ffffff'
                                            }
                                        />
                                        <PinInputField
                                            borderRadius="12px"
                                            border={`1px solid ${
                                                isDark ? '#ffffff29' : '#ebebeb'
                                            }`}
                                            _hover={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff40'
                                                        : '#e0e0e0'
                                                }`,
                                            }}
                                            _focus={{
                                                border: `1px solid ${
                                                    isDark
                                                        ? '#ffffff60'
                                                        : '#d0d0d0'
                                                }`,
                                                boxShadow: 'none',
                                            }}
                                            backgroundColor={
                                                isDark
                                                    ? 'transparent'
                                                    : '#ffffff'
                                            }
                                        />
                                    </PinInput>
                                </HStack>
                                {error && (
                                    <Text color="red.500" fontSize="xs">
                                        {error}
                                    </Text>
                                )}
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
            </ModalContent>
        </Modal>
    );
};
