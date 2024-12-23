// import {
//     Button,
//     Icon,
//     Input,
//     InputGroup,
//     InputLeftElement,
//     Stack,
//     useColorMode,
// } from '@chakra-ui/react';
// import { useLoginWithEmail } from '@privy-io/react-auth';
// import { useState } from 'react';
// import { MdEmail } from 'react-icons/md';
// import { ConnectModalContents } from './ConnectModal';

// type Props = {
//     onClose: () => void;
//     setCurrentContent: (content: ConnectModalContents) => void;
// };

// export const EmailLoginButton = ({ onClose, setCurrentContent }: Props) => {
//     const { colorMode } = useColorMode();
//     const isDark = colorMode === 'dark';

//     const [email, setEmail] = useState('');
//     const [code, setCode] = useState('');

//     const {
//         sendCode,
//         loginWithCode,
//         state: emailState,
//     } = useLoginWithEmail({
//         onComplete: ({ user, isNewUser }) => {
//             console.log('Login successful', { user, isNewUser });
//             onClose();
//         },
//         onError: (error) => {
//             console.error('Login error:', error);
//         },
//     });

//     const handleSendCode = async () => {
//         await sendCode({ email });
//         setEmailVerificationData({
//             email,
//             onSubmit: (code) => loginWithCode({ code }),
//             onResend: () => sendCode({ email }),
//         });
//         setCurrentContent('email-verification');
//     };

//     return (
//         <Stack spacing={3} w="full">
//             {emailState.status === 'initial' && (
//                 <InputGroup size="lg">
//                     <InputLeftElement pointerEvents="none" height="100%" pl={4}>
//                         <Icon
//                             as={MdEmail}
//                             color={isDark ? 'whiteAlpha.600' : 'gray.400'}
//                             w={'20px'}
//                             h={'20px'}
//                         />
//                     </InputLeftElement>
//                     <Input
//                         placeholder="your@email.com"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         pl={12}
//                         pr={24}
//                         py={6}
//                         borderRadius="full"
//                         border={`1px solid ${isDark ? '#ffffff29' : '#ebebeb'}`}
//                         _hover={{
//                             border: `1px solid ${
//                                 isDark ? '#ffffff40' : '#e0e0e0'
//                             }`,
//                         }}
//                         _focus={{
//                             border: `1px solid ${
//                                 isDark ? '#ffffff60' : '#d0d0d0'
//                             }`,
//                             boxShadow: 'none',
//                         }}
//                         backgroundColor={isDark ? 'transparent' : '#ffffff'}
//                     />
//                     <Button
//                         position="absolute"
//                         right={2}
//                         top="50%"
//                         transform="translateY(-50%)"
//                         zIndex={2}
//                         colorScheme="blue"
//                         size="sm"
//                         px={6}
//                         borderRadius="full"
//                         isLoading={emailState.status === 'sending-code'}
//                         onClick={handleSendCode}
//                     >
//                         Submit
//                     </Button>
//                 </InputGroup>
//             )}
//         </Stack>
//     );
// };
