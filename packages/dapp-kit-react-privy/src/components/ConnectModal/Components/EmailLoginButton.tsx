import {
    Button,
    Icon,
    Input,
    InputGroup,
    InputLeftElement,
    useColorMode,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { useLoginWithEmail } from '@privy-io/react-auth';
import { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { EmailCodeVerificationModal } from '../../EmailCodeVerificationModal/EmailCodeVerificationModal';

export const EmailLoginButton = () => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    // Email login
    const [email, setEmail] = useState('');

    const { sendCode, state: emailState } = useLoginWithEmail({});

    const emailCodeVerificationModal = useDisclosure();

    const handleSendCode = async () => {
        await sendCode({ email });
        // onClose();
        emailCodeVerificationModal.onOpen();
    };

    return (
        <>
            <VStack spacing={3} w="full">
                <InputGroup size="lg" w="full">
                    <InputLeftElement pointerEvents="none" height="100%" pl={4}>
                        <Icon
                            as={MdEmail}
                            color={isDark ? 'whiteAlpha.600' : 'gray.400'}
                            w={'20px'}
                            h={'20px'}
                        />
                    </InputLeftElement>
                    <Input
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant={'loginIn'}
                        fontSize={'14px'}
                        fontWeight={'400'}
                        backgroundColor={isDark ? 'transparent' : '#ffffff'}
                        border={`1px solid ${isDark ? '#ffffff0a' : '#ebebeb'}`}
                        p={6}
                        borderRadius={16}
                        w={'full'}
                        pl={12}
                    />
                    <Button
                        aria-label="Send code"
                        position="absolute"
                        right={2}
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={2}
                        variant="ghost"
                        size="sm"
                        px={6}
                        borderRadius="full"
                        isLoading={emailState.status === 'sending-code'}
                        onClick={handleSendCode}
                    >
                        Submit
                    </Button>
                </InputGroup>
            </VStack>

            <EmailCodeVerificationModal
                isOpen={emailCodeVerificationModal.isOpen}
                onClose={emailCodeVerificationModal.onClose}
                onResend={() => sendCode({ email })}
                email={email}
                isLoading={emailState.status === 'sending-code'}
            />
        </>
    );
};
