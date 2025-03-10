import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DAppKitLogger } from '../../src';

describe('DAppKitLogger', function () {
    const debugMock = vi
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

    const infoMock = vi
        .spyOn(console, 'info')
        .mockImplementation(() => undefined);

    const warnMock = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

    const errorMock = vi
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

    beforeEach(() => {
        debugMock.mockReset();
        infoMock.mockReset();
        warnMock.mockReset();
        errorMock.mockReset();
    });

    it('when log level is set to none', () => {
        DAppKitLogger.configure('NONE');

        DAppKitLogger.debug('domain', 'context', 'Hello World');
        DAppKitLogger.info('domain', 'context', 'Hello World');
        DAppKitLogger.warn('domain', 'context', 'Hello World');
        DAppKitLogger.error('domain', 'context', 'Hello World');

        expect(debugMock).not.toHaveBeenCalled();
        expect(infoMock).not.toHaveBeenCalled();
        expect(warnMock).not.toHaveBeenCalled();
        expect(errorMock).not.toHaveBeenCalled();
    });

    it('when log level is set to debug', () => {
        DAppKitLogger.configure('DEBUG');

        DAppKitLogger.debug('domain', 'context', 'Hello World');
        DAppKitLogger.info('domain', 'context', 'Hello World');
        DAppKitLogger.warn('domain', 'context', 'Hello World');
        DAppKitLogger.error('domain', 'context', 'Hello World');

        expect(debugMock).toHaveBeenCalledTimes(1);
        expect(infoMock).toHaveBeenCalledTimes(1);
        expect(warnMock).toHaveBeenCalledTimes(1);
        expect(errorMock).toHaveBeenCalledTimes(1);
    });

    it('when log level is set to INFO', () => {
        DAppKitLogger.configure('INFO');

        DAppKitLogger.debug('domain', 'context', 'Hello World');
        DAppKitLogger.info('domain', 'context', 'Hello World');
        DAppKitLogger.warn('domain', 'context', 'Hello World');
        DAppKitLogger.error('domain', 'context', 'Hello World');

        expect(debugMock).toHaveBeenCalledTimes(0);
        expect(infoMock).toHaveBeenCalledTimes(1);
        expect(warnMock).toHaveBeenCalledTimes(1);
        expect(errorMock).toHaveBeenCalledTimes(1);
    });

    it('when log level is set to WARN', () => {
        DAppKitLogger.configure('WARN');

        DAppKitLogger.debug('domain', 'context', 'Hello World');
        DAppKitLogger.info('domain', 'context', 'Hello World');
        DAppKitLogger.warn('domain', 'context', 'Hello World');
        DAppKitLogger.error('domain', 'context', 'Hello World');

        expect(debugMock).not.toHaveBeenCalled();
        expect(infoMock).not.toHaveBeenCalled();
        expect(warnMock).toHaveBeenCalledTimes(1);
        expect(errorMock).toHaveBeenCalledTimes(1);
    });

    it('when log level is set to ERROR', () => {
        DAppKitLogger.configure('ERROR');

        DAppKitLogger.debug('domain', 'context', 'Hello World');
        DAppKitLogger.info('domain', 'context', 'Hello World');
        DAppKitLogger.warn('domain', 'context', 'Hello World');
        DAppKitLogger.error('domain', 'context', 'Hello World');

        expect(debugMock).not.toHaveBeenCalled();
        expect(infoMock).not.toHaveBeenCalled();
        expect(warnMock).not.toHaveBeenCalled();
        expect(errorMock).toHaveBeenCalledTimes(1);
    });

    it('when log level has not been set', () => {
        DAppKitLogger.configure('NONE');

        DAppKitLogger.debug('domain', 'context', 'Hello World');
        DAppKitLogger.info('domain', 'context', 'Hello World');
        DAppKitLogger.warn('domain', 'context', 'Hello World');
        DAppKitLogger.error('domain', 'context', 'Hello World');

        expect(debugMock).not.toHaveBeenCalled();
        expect(infoMock).not.toHaveBeenCalled();
        expect(warnMock).not.toHaveBeenCalled();
        expect(errorMock).not.toHaveBeenCalled();
    });
});
