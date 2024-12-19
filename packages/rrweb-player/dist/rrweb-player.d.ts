import { eventWithTime } from '@supademo/rrweb-types';
import { Mirror } from '@supademo/rrweb-snapshot';
import { playerConfig } from '@supademo/rrweb-replay';
import { playerMetaData } from '@supademo/rrweb-types';
import { Replayer } from '@supademo/rrweb-replay';
import { SvelteComponent } from 'svelte';

declare const __propDef: {
    props: {
        [x: string]: any;
        width?: NonNullable<RRwebPlayerOptions["props"]["width"]> | undefined;
        height?: NonNullable<RRwebPlayerOptions["props"]["height"]> | undefined;
        maxScale?: NonNullable<RRwebPlayerOptions["props"]["maxScale"]> | undefined;
        events: RRwebPlayerOptions["props"]["events"];
        skipInactive?: NonNullable<RRwebPlayerOptions["props"]["skipInactive"]> | undefined;
        autoPlay?: NonNullable<RRwebPlayerOptions["props"]["autoPlay"]> | undefined;
        speedOption?: NonNullable<RRwebPlayerOptions["props"]["speedOption"]> | undefined;
        speed?: NonNullable<RRwebPlayerOptions["props"]["speed"]> | undefined;
        showController?: NonNullable<RRwebPlayerOptions["props"]["showController"]> | undefined;
        tags?: NonNullable<RRwebPlayerOptions["props"]["tags"]> | undefined;
        inactiveColor?: NonNullable<RRwebPlayerOptions["props"]["inactiveColor"]> | undefined;
        getMirror?: (() => Mirror) | undefined;
        triggerResize?: RRwebPlayerExpose["triggerResize"] | undefined;
        toggleFullscreen?: RRwebPlayerExpose["toggleFullscreen"] | undefined;
        addEventListener?: RRwebPlayerExpose["addEventListener"] | undefined;
        addEvent?: RRwebPlayerExpose["addEvent"] | undefined;
        getMetaData?: RRwebPlayerExpose["getMetaData"] | undefined;
        getReplayer?: RRwebPlayerExpose["getReplayer"] | undefined;
        toggle?: RRwebPlayerExpose["toggle"] | undefined;
        setSpeed?: RRwebPlayerExpose["setSpeed"] | undefined;
        toggleSkipInactive?: RRwebPlayerExpose["toggleSkipInactive"] | undefined;
        play?: RRwebPlayerExpose["play"] | undefined;
        pause?: RRwebPlayerExpose["pause"] | undefined;
        goto?: RRwebPlayerExpose["goto"] | undefined;
        playRange?: RRwebPlayerExpose["playRange"] | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: undefined;
    bindings?: undefined;
};

declare class Player extends Player_2 {
    constructor(options: {
        data?: RRwebPlayerOptions['props'];
    } & RRwebPlayerOptions);
}
export { Player }
export default Player;

declare class Player_2 extends SvelteComponent<PlayerProps, PlayerEvents, PlayerSlots> {
    get getMirror(): () => Mirror;
    get triggerResize(): () => void;
    get toggleFullscreen(): () => void;
    get addEventListener(): (event: string, handler: (params: unknown) => unknown) => void;
    get addEvent(): (event: eventWithTime) => void;
    get getMetaData(): () => playerMetaData;
    get getReplayer(): () => Replayer;
    get toggle(): () => void;
    get setSpeed(): (speed: number) => void;
    get toggleSkipInactive(): () => void;
    get play(): () => void;
    get pause(): () => void;
    get goto(): (timeOffset: number, play?: boolean) => void;
    get playRange(): (timeOffset: number, endTimeOffset: number, startLooping?: boolean, afterHook?: undefined | (() => void)) => void;
}

declare type PlayerEvents = typeof __propDef.events;

declare type PlayerProps = typeof __propDef.props;

declare type PlayerSlots = typeof __propDef.slots;

declare type RRwebPlayerExpose = {
    addEventListener: (event: string, handler: (params: unknown) => unknown) => void;
    addEvent: (event: eventWithTime) => void;
    getMetaData: Replayer['getMetaData'];
    getReplayer: () => Replayer;
    getMirror: () => Mirror;
    toggle: () => void;
    setSpeed: (speed: number) => void;
    toggleSkipInactive: () => void;
    toggleFullscreen: () => void;
    triggerResize: () => void;
    $set: (options: {
        width: number;
        height: number;
    }) => void;
    play: () => void;
    pause: () => void;
    goto: (timeOffset: number, play?: boolean) => void;
    playRange: (timeOffset: number, endTimeOffset: number, startLooping?: boolean, afterHook?: undefined | (() => void)) => void;
};

declare type RRwebPlayerOptions = {
    target: HTMLElement;
    props: {
        events: eventWithTime[];
        width?: number;
        height?: number;
        maxScale?: number;
        autoPlay?: boolean;
        speed?: number;
        speedOption?: number[];
        showController?: boolean;
        tags?: Record<string, string>;
        inactiveColor?: string;
    } & Partial<playerConfig>;
};

export { }

declare global {
    interface Document {
        mozExitFullscreen: Document['exitFullscreen'];
        webkitExitFullscreen: Document['exitFullscreen'];
        msExitFullscreen: Document['exitFullscreen'];
        webkitIsFullScreen: Document['fullscreen'];
        mozFullScreen: Document['fullscreen'];
        msFullscreenElement: Document['fullscreen'];
    }
    interface HTMLElement {
        mozRequestFullScreen: Element['requestFullscreen'];
        webkitRequestFullscreen: Element['requestFullscreen'];
        msRequestFullscreen: Element['requestFullscreen'];
    }
}
