import { ReplayPlugin } from '@supademo/rrweb';
import { SequentialIdOptions } from '@supademo/rrweb-plugin-sequential-id-record';

export declare const getReplaySequentialIdPlugin: (options?: Partial<Options>) => ReplayPlugin;

declare type Options = SequentialIdOptions & {
    warnOnMissingId: boolean;
};

export { }
