import { convertVendorToSigner } from '../../src';
import { vi, it, describe, expect } from 'vitest';

describe('convertVendorToSigner', () => {
    it('should return the correct message', async () => {
        const gasMock = vi.fn();
        const signerMock = vi.fn();
        const dependsOnMock = vi.fn();
        const linkMock = vi.fn();
        const commentMock = vi.fn();
        const delegateMock = vi.fn();
        const acceptedMock = vi.fn();
        const requestMock = vi.fn();
        const mockSign = vi.fn(() => ({
            gas: gasMock,
            signer: signerMock,
            dependsOn: dependsOnMock,
            link: linkMock,
            comment: commentMock,
            delegate: delegateMock,
            accepted: acceptedMock,
            request: requestMock,
        }));
        const vendorMock = {
            sign: mockSign,
        };

        // Create a fake transaction message and options
        const fakeMsg = 'Your fake transaction message';
        const fakeOptions = {
            gas: 100000,
        };

        // Call the function with the mock
        const signer = convertVendorToSigner(vendorMock as Connex.Vendor);
        await signer.signTx([{ to: 'address', value: fakeMsg }], fakeOptions);

        expect(mockSign).toHaveBeenCalledWith('tx', [
            {
                to: 'address',
                value: fakeMsg,
            },
        ]);

        await signer.signCert(
            {
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content: '',
                },
            },
            {},
        );
        expect(mockSign).toHaveBeenCalledWith('cert', {
            purpose: 'identification',
            payload: {
                type: 'text',
                content: '',
            },
        });

        expect(gasMock).toHaveBeenCalledWith(fakeOptions.gas);
        expect(requestMock).toHaveBeenCalled();
    });
    it('should call it with multiple options', async () => {
        const gasMock = vi.fn();
        const signerMock = vi.fn();
        const dependsOnMock = vi.fn();
        const linkMock = vi.fn();
        const commentMock = vi.fn();
        const delegateMock = vi.fn();
        const acceptedMock = vi.fn();
        const requestMock = vi.fn();
        const mockSign = vi.fn(() => ({
            gas: gasMock,
            signer: signerMock,
            dependsOn: dependsOnMock,
            link: linkMock,
            comment: commentMock,
            delegate: delegateMock,
            accepted: acceptedMock,
            request: requestMock,
        }));
        const vendorMock = {
            sign: mockSign,
        };

        // Create a fake transaction message and options
        const fakeMsg = 'Your fake transaction message';
        const fakeOptions = {
            signer: '0x1234567890',
            dependsOn: '0x0987654321',
            link: 'https://example.com',
            comment: 'This is a comment',
            onAccepted: () => {},
            delegator: {
                url: 'https://example.com',
                signer: '0x1234567890',
            },
        };

        // Call the function with the mock
        const signer = convertVendorToSigner(vendorMock);
        await signer.signTx([{ to: 'address', value: fakeMsg }], fakeOptions);
        expect(mockSign).toHaveBeenCalledWith('tx', [
            {
                to: 'address',
                value: fakeMsg,
            },
        ]);
        await signer.signCert(
            {
                purpose: 'identification',
                payload: {
                    type: 'text',
                    content: '',
                },
            },
            fakeOptions,
        );
        expect(mockSign).toHaveBeenCalledWith('cert', {
            purpose: 'identification',
            payload: {
                type: 'text',
                content: '',
            },
        });

        expect(gasMock).not.toHaveBeenCalled();
        expect(signerMock).toHaveBeenCalledWith(fakeOptions.signer);
        expect(dependsOnMock).toHaveBeenCalledWith(fakeOptions.dependsOn);
        expect(linkMock).toHaveBeenCalledWith(fakeOptions.link);
        expect(commentMock).toHaveBeenCalledWith(fakeOptions.comment);
        expect(delegateMock).toHaveBeenCalledWith(
            fakeOptions.delegator.url,
            fakeOptions.delegator.signer,
        );
        expect(acceptedMock).toHaveBeenCalledWith(fakeOptions.onAccepted);
        expect(requestMock).toHaveBeenCalled();
    });
});
