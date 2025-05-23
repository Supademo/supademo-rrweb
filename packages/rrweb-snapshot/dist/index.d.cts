import { DataURLOptions } from '@supademo/rrweb-types';
import { IMirror } from '@supademo/rrweb-types';
import { serializedElementNodeWithId } from '@supademo/rrweb-types';
import { serializedNode } from '@supademo/rrweb-types';
import { serializedNodeWithId } from '@supademo/rrweb-types';

export declare function absolutifyURLs(cssText: string | null, href: string): string;

export declare function adaptCssForReplay(cssText: string, cache: BuildCache): string;

export declare type BuildCache = {
    stylesWithHoverClass: Map<string, string>;
};

export declare function buildNodeWithSN(n: serializedNodeWithId, options: {
    doc: Document;
    mirror: Mirror;
    skipChild?: boolean;
    hackCss: boolean;
    afterAppend?: (n: Node, id: number) => unknown;
    cache: BuildCache;
}): Node | null;

export declare function classMatchesRegex(node: Node | null, regex: RegExp, checkAncestors: boolean): boolean;

export declare function cleanupSnapshot(): void;

export declare function createCache(): BuildCache;

export declare function createMirror(): Mirror;

declare interface CSSImportRule_2 extends CSSRule {
    readonly href: string;
    readonly layerName: string | null;
    readonly media: MediaList;
    readonly styleSheet: CSSStyleSheet;
    readonly supportsText?: string | null;
}

export declare type DialogAttributes = {
    open: string;
    rr_open_mode: 'modal' | 'non-modal';
};

export declare function escapeImportStatement(rule: CSSImportRule_2): string;

export declare function extractFileExtension(path: string, baseURL?: string): string | null;

export declare function fixSafariColons(cssStringified: string): string;

export declare function genId(): number;

export declare function getInputType(element: HTMLElement): Lowercase<string> | null;

export declare interface ICanvas extends HTMLCanvasElement {
    __context: string;
}

export declare type idNodeMap = Map<number, Node>;

export declare function ignoreAttribute(tagName: string, name: string, _value: unknown): boolean;

export declare const IGNORED_NODE = -2;

export declare function is2DCanvasBlank(canvas: HTMLCanvasElement): boolean;

export declare function isCSSImportRule(rule: CSSRule): rule is CSSImportRule_2;

export declare function isCSSStyleRule(rule: CSSRule): rule is CSSStyleRule;

export declare function isElement(n: Node): n is Element;

export declare function isNativeShadowDom(shadowRoot: ShadowRoot): boolean;

export declare function isNodeMetaEqual(a: serializedNode, b: serializedNode): boolean;

export declare function isShadowRoot(n: Node): n is ShadowRoot;

export declare type KeepIframeSrcFn = (src: string) => boolean;

export declare function markCssSplits(cssText: string, style: HTMLStyleElement): string;

export declare type MaskInputFn = (text: string, element: HTMLElement) => string;

export declare type MaskInputOptions = Partial<{
    color: boolean;
    date: boolean;
    'datetime-local': boolean;
    email: boolean;
    month: boolean;
    number: boolean;
    range: boolean;
    search: boolean;
    tel: boolean;
    text: boolean;
    time: boolean;
    url: boolean;
    week: boolean;
    textarea: boolean;
    select: boolean;
    password: boolean;
}>;

export declare function maskInputValue({ element, maskInputOptions, tagName, type, value, maskInputFn, }: {
    element: HTMLElement;
    maskInputOptions: MaskInputOptions;
    tagName: string;
    type: string | null;
    value: string | null;
    maskInputFn?: MaskInputFn;
}): string;

export declare type MaskTextFn = (text: string, element: HTMLElement | null) => string;

export declare class Mirror implements IMirror<Node> {
    private idNodeMap;
    private nodeMetaMap;
    getId(n: Node | undefined | null): number;
    getNode(id: number): Node | null;
    getIds(): number[];
    getMeta(n: Node): serializedNodeWithId | null;
    removeNodeFromMap(n: Node): void;
    has(id: number): boolean;
    hasNode(node: Node): boolean;
    add(n: Node, meta: serializedNodeWithId): void;
    replace(id: number, n: Node): void;
    reset(): void;
}

export declare function needMaskingText(node: Node, maskTextClass: string | RegExp, maskTextSelector: string | null, checkAncestors: boolean): boolean;

export declare type nodeMetaMap = WeakMap<Node, serializedNodeWithId>;

export declare function normalizeCssString(cssText: string): string;

export declare function rebuild(n: serializedNodeWithId, options: {
    doc: Document;
    onVisit?: (node: Node) => unknown;
    hackCss?: boolean;
    afterAppend?: (n: Node, id: number) => unknown;
    cache: BuildCache;
    mirror: Mirror;
}): Node | null;

export declare function serializeNodeWithId(n: Node, options: {
    doc: Document;
    mirror: Mirror;
    blockClass: string | RegExp;
    blockSelector: string | null;
    ignoreSelector: string | null;
    maskTextClass: string | RegExp;
    maskTextSelector: string | null;
    skipChild: boolean;
    inlineStylesheet: boolean;
    newlyAddedElement?: boolean;
    maskInputOptions?: MaskInputOptions;
    needsMask?: boolean;
    maskTextFn: MaskTextFn | undefined;
    maskInputFn: MaskInputFn | undefined;
    slimDOMOptions: SlimDOMOptions;
    dataURLOptions?: DataURLOptions;
    keepIframeSrcFn?: KeepIframeSrcFn;
    inlineImages?: boolean;
    recordCanvas?: boolean;
    preserveWhiteSpace?: boolean;
    onSerialize?: (n: Node) => unknown;
    onIframeLoad?: (iframeNode: HTMLIFrameElement, node: serializedElementNodeWithId) => unknown;
    iframeLoadTimeout?: number;
    onStylesheetLoad?: (linkNode: HTMLLinkElement, node: serializedElementNodeWithId) => unknown;
    stylesheetLoadTimeout?: number;
    cssCaptured?: boolean;
    customGenId?: () => number;
}): serializedNodeWithId | null;

export declare type SlimDOMOptions = Partial<{
    script: boolean;
    comment: boolean;
    headFavicon: boolean;
    headWhitespace: boolean;
    headMetaDescKeywords: boolean;
    headMetaSocial: boolean;
    headMetaRobots: boolean;
    headMetaHttpEquiv: boolean;
    headMetaAuthorship: boolean;
    headMetaVerification: boolean;
    headTitleMutations: boolean;
}>;

export declare function snapshot(n: Document, options?: {
    mirror?: Mirror;
    blockClass?: string | RegExp;
    blockSelector?: string | null;
    ignoreSelector?: string | null;
    maskTextClass?: string | RegExp;
    maskTextSelector?: string | null;
    inlineStylesheet?: boolean;
    maskAllInputs?: boolean | MaskInputOptions;
    maskTextFn?: MaskTextFn;
    maskInputFn?: MaskInputFn;
    slimDOM?: 'all' | boolean | SlimDOMOptions;
    dataURLOptions?: DataURLOptions;
    inlineImages?: boolean;
    recordCanvas?: boolean;
    preserveWhiteSpace?: boolean;
    onSerialize?: (n: Node) => unknown;
    onIframeLoad?: (iframeNode: HTMLIFrameElement, node: serializedElementNodeWithId) => unknown;
    iframeLoadTimeout?: number;
    onStylesheetLoad?: (linkNode: HTMLLinkElement, node: serializedElementNodeWithId) => unknown;
    stylesheetLoadTimeout?: number;
    keepIframeSrcFn?: KeepIframeSrcFn;
    customGenId?: () => number;
}): serializedNodeWithId | null;

export declare function splitCssText(cssText: string, style: HTMLStyleElement): string[];

export declare function stringifyRule(rule: CSSRule, sheetHref: string | null): string;

export declare function stringifyStylesheet(s: CSSStyleSheet): string | null;

export declare type tagMap = {
    [key: string]: string;
};

export declare function toLowerCase<T extends string>(str: T): Lowercase<T>;

export declare function transformAttribute(doc: Document, tagName: Lowercase<string>, name: Lowercase<string>, value: string | null): string | null;

export declare function visitSnapshot(node: serializedNodeWithId, onVisit: (node: serializedNodeWithId) => unknown): void;

export { }
