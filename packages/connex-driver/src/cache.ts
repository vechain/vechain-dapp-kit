import * as LRU from 'lru-cache';
import BigNumber from 'bignumber.js';
import { newFilter } from './bloom';
import { Connex } from '@vechain/connex-framework';

const WINDOW_LEN = 12;

type Slot = Connex.Thor.Status['head'] & {
    bloom?: ReturnType<typeof newFilter>;
    block?: Connex.Thor.Block;

    accounts: Map<string, Account>;
    txs: Map<string, Connex.Thor.Transaction>;
    receipts: Map<string, Connex.Thor.Transaction.Receipt>;
    tied: Map<string, any>;
};

export class Cache {
    private readonly irreversible = {
        blocks: new LRU<string | number, Connex.Thor.Block>(256),
        txs: new LRU<string, Connex.Thor.Transaction>(512),
        receipts: new LRU<string, Connex.Thor.Transaction.Receipt>(512),
    };
    private readonly window: Slot[] = [];

    public handleNewBlock(
        head: Connex.Thor.Status['head'],
        bloom?: { bits: string; k: number },
        block?: Connex.Thor.Block,
    ): void {
        while (this.window.length > 0) {
            const top = this.window[this.window.length - 1];
            if (top.id === head.id) {
                return;
            }
            if (top.id === head.parentID) {
                break;
            }
            this.window.pop();
        }

        this.window.push({
            ...head,
            bloom: bloom
                ? newFilter(Buffer.from(bloom.bits.slice(2), 'hex'), bloom.k)
                : undefined,
            block,
            accounts: new Map<string, Account>(),
            txs: new Map<string, Connex.Thor.Transaction>(),
            receipts: new Map<string, Connex.Thor.Transaction.Receipt>(),
            tied: new Map<string, any>(),
        });

        // shift out old slots and move cached items into frozen cache
        while (this.window.length > WINDOW_LEN) {
            const bottom = this.window.shift()!;

            bottom.txs.forEach((v, k) => this.irreversible.txs.set(k, v));
            bottom.receipts.forEach((v, k) =>
                this.irreversible.receipts.set(k, v),
            );
            if (bottom.block) {
                this.irreversible.blocks.set(bottom.block.id, bottom.block);
                this.irreversible.blocks.set(bottom.block.number, bottom.block);
            }
        }
    }

    public async getBlock(
        revision: string | number,
        fetch: () => Promise<Connex.Thor.Block | null>,
    ): Promise<Connex.Thor.Block | null> {
        let block = this.irreversible.blocks.get(revision) || null;
        if (block) {
            return block;
        }

        const { slot } = this.findSlot(revision);

        if (slot && slot.block) {
            return slot.block;
        }

        block = await fetch();
        if (block) {
            if (slot && slot.id === block.id) {
                slot.block = block;
            }

            if (this.isIrreversible(block.number)) {
                this.irreversible.blocks.set(block.id, block);
                if (block.isTrunk) {
                    this.irreversible.blocks.set(block.number, block);
                }
            }
        }
        return block;
    }

    public async getTx(
        txid: string,
        fetch: () => Promise<Connex.Thor.Transaction | null>,
    ): Promise<Connex.Thor.Transaction | null> {
        let tx = this.irreversible.txs.get(txid) || null;
        if (tx) {
            return tx;
        }

        for (const slot of this.window) {
            tx = slot.txs.get(txid) || null;
            if (tx) {
                return tx;
            }
        }

        tx = await fetch();
        if (tx && tx.meta) {
            // only cache non-pending tx
            const { slot } = this.findSlot(tx.meta.blockID);
            if (slot) {
                slot.txs.set(txid, tx);
            }
            if (this.isIrreversible(tx.meta.blockNumber)) {
                this.irreversible.txs.set(txid, tx);
            }
        }
        return tx;
    }

    public async getReceipt(
        txid: string,
        fetch: () => Promise<Connex.Thor.Transaction.Receipt | null>,
    ): Promise<Connex.Thor.Transaction.Receipt | null> {
        let receipt = this.irreversible.receipts.get(txid) || null;
        if (receipt) {
            return receipt;
        }

        for (const slot of this.window) {
            receipt = slot.receipts.get(txid) || null;
            if (receipt) {
                return receipt;
            }
        }

        receipt = await fetch();
        if (receipt) {
            const { slot } = this.findSlot(receipt.meta.blockID);
            if (slot) {
                slot.receipts.set(txid, receipt);
            }
            if (this.isIrreversible(receipt.meta.blockNumber)) {
                this.irreversible.receipts.set(txid, receipt);
            }
        }
        return receipt;
    }

    public async getAccount(
        addr: string,
        revision: string,
        fetch: () => Promise<Connex.Thor.Account>,
    ): Promise<Connex.Thor.Account> {
        const found = this.findSlot(revision);
        for (let i = found.index; i >= 0; i--) {
            const slot = this.window[i];
            const acc = slot.accounts.get(addr);
            if (acc) {
                if (i !== found.index) {
                    found.slot!.accounts.set(addr, acc);
                }
                return acc.snapshot(found.slot!.timestamp);
            }

            if (!slot.bloom || testBytesHex(slot.bloom, addr)) {
                // account might be dirty
                break;
            }
        }
        const accObj = await fetch();
        if (found.slot) {
            found.slot.accounts.set(
                addr,
                new Account(accObj, found.slot.timestamp),
            );
        }
        return accObj;
    }

    /**
     * get cached entry which is tied to a batch of addresses
     * @param key the cache key
     * @param revision block id where cache bound to
     * @param fetch to fetch value when cache missing
     * @param hints array of tied addresses, as the gist to invalidate cache key. undefined means the key is always
     * invalidated on different revision.
     */
    public async getTied(
        key: string,
        revision: string,
        fetch: () => Promise<any>,
        hints?: string[],
    ): Promise<any> {
        const found = this.findSlot(revision);
        for (let i = found.index; i >= 0; i--) {
            const slot = this.window[i];
            const v = slot.tied.get(key);
            if (v) {
                if (i !== found.index) {
                    found.slot!.tied.set(key, v);
                }
                return v;
            }

            if (!slot.bloom || !hints) {
                break;
            }

            // if hints.length === 0, never invalidate cache
            if (hints.some((t) => testBytesHex(slot.bloom!, t))) {
                // might be dirty
                break;
            }
        }
        const value = await fetch();
        if (found.slot) {
            found.slot.tied.set(key, value);
        }
        return value;
    }

    private findSlot(revision: string | number) {
        const index = this.window.findIndex(
            (s) => s.id === revision || s.number === revision,
        );
        if (index >= 0) {
            return { slot: this.window[index], index };
        }
        return { index };
    }

    private isIrreversible(n: number) {
        if (this.window.length > 0) {
            return n < this.window[this.window.length - 1].number - WINDOW_LEN;
        }
        return false;
    }
}

function testBytesHex(filter: ReturnType<typeof newFilter>, hex: string) {
    let buf = Buffer.from(hex.slice(2), 'hex');
    const nzIndex = buf.findIndex((v) => v !== 0);
    if (nzIndex < 0) {
        buf = Buffer.alloc(0);
    } else {
        buf = buf.slice(nzIndex);
    }
    return filter.contains(buf);
}

const ENERGY_GROWTH_RATE = 5000000000;

class Account {
    constructor(
        readonly obj: Connex.Thor.Account,
        readonly initTimestamp: number,
    ) {}

    public snapshot(timestamp: number) {
        return { ...this.obj, energy: this.energyAt(timestamp) };
    }

    private energyAt(timestamp: number) {
        if (timestamp < this.initTimestamp) {
            return this.obj.energy;
        }
        return (
            '0x' +
            new BigNumber(this.obj.balance)
                .times(timestamp - this.initTimestamp)
                .times(ENERGY_GROWTH_RATE)
                .dividedToIntegerBy(1e18)
                .plus(this.obj.energy)
                .toString(16)
        );
    }
}
