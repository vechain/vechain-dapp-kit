import { ExpandedConnexSigner } from '../types/types';
import { DAppKitLogger } from './logger';

export const convertVendorToSigner = (
    vendor: Connex.Vendor,
): ExpandedConnexSigner => {
    return {
        signTx: (msg, options): Promise<Connex.Vendor.TxResponse> => {
            const service = vendor.sign('tx', msg);

            if (options.gas) {
                service.gas(options.gas);
            }

            if (options.signer) {
                service.signer(options.signer);
            }

            if (options.dependsOn) {
                service.dependsOn(options.dependsOn);
            }

            if (options.link) {
                service.link(options.link);
            }

            if (options.comment) {
                service.comment(options.comment);
            }

            if (options.delegator) {
                service.delegate(
                    options.delegator.url,
                    options.delegator.signer,
                );
            }

            if (options.onAccepted) {
                service.accepted(options.onAccepted);
            }

            DAppKitLogger.debug('vendor', 'signTx', {
                messages: msg.length,
                options,
            });

            return service.request();
        },

        signCert: (msg, options): Promise<Connex.Vendor.CertResponse> => {
            const service = vendor.sign('cert', msg);

            if (options.signer) {
                service.signer(options.signer);
            }

            if (options.link) {
                service.link(options.link);
            }

            if (options.onAccepted) {
                service.accepted(options.onAccepted);
            }

            DAppKitLogger.debug('vendor', 'signCert', {
                message: msg,
                options,
            });

            return service.request();
        },

        signTypedData(_domain, _types, _value) {
            return Promise.reject(new Error('Method not implemented.'));
        },
    };
};
