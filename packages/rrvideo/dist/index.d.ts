import type Player from '@supademo/rrweb-player';
type RRvideoConfig = {
    input: string;
    output?: string;
    headless?: boolean;
    resolutionRatio?: number;
    onProgressUpdate?: (percent: number) => void;
    rrwebPlayer?: Omit<ConstructorParameters<typeof Player>[0]['props'], 'events'>;
};
export declare function transformToVideo(options: RRvideoConfig): Promise<string>;
export {};
