import { BaseRRCDATASection } from '@supademo/rrdom';
import { BaseRRComment } from '@supademo/rrdom';
import { BaseRRDocument } from '@supademo/rrdom';
import { BaseRRDocumentType } from '@supademo/rrdom';
import { BaseRRElement } from '@supademo/rrdom';
import { BaseRRMediaElement } from '@supademo/rrdom';
import { BaseRRNode } from '@supademo/rrdom';
import { BaseRRText } from '@supademo/rrdom';
import { CSSStyleDeclaration as CSSStyleDeclaration_2 } from '@supademo/rrdom';
import { IRRDocument } from '@supademo/rrdom';
import { IRRNode } from '@supademo/rrdom';
import { NWSAPI } from 'nwsapi';

export declare class RRCanvasElement extends RRElement {
    getContext(): CanvasRenderingContext2D | null;
}

export declare class RRCDATASection extends BaseRRCDATASection {
    readonly nodeName: "#cdata-section";
}

export declare class RRComment extends BaseRRComment {
    readonly nodeName: "#comment";
}

export declare class RRDocument extends BaseRRDocument implements IRRDocument {
    readonly nodeName: "#document";
    private _nwsapi;
    get nwsapi(): NWSAPI;
    get documentElement(): RRElement | null;
    get body(): RRElement | null;
    get head(): RRElement | null;
    get implementation(): RRDocument;
    get firstElementChild(): RRElement | null;
    appendChild(childNode: BaseRRNode): IRRNode;
    insertBefore(newChild: BaseRRNode, refChild: BaseRRNode | null): IRRNode;
    querySelectorAll(selectors: string): BaseRRNode[];
    getElementsByTagName(tagName: string): RRElement[];
    getElementsByClassName(className: string): RRElement[];
    getElementById(elementId: string): RRElement | null;
    createDocument(_namespace: string | null, _qualifiedName: string | null, _doctype?: DocumentType | null): RRDocument;
    createDocumentType(qualifiedName: string, publicId: string, systemId: string): RRDocumentType;
    createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): RRElementType<K>;
    createElement(tagName: string): RRElement;
    createElementNS(_namespaceURI: string, qualifiedName: string): RRElement | RRMediaElement | RRCanvasElement | RRIFrameElement | RRImageElement | RRStyleElement;
    createComment(data: string): RRComment;
    createCDATASection(data: string): RRCDATASection;
    createTextNode(data: string): RRText;
}

export declare class RRDocumentType extends BaseRRDocumentType {
}

export declare class RRElement extends BaseRRElement {
    private _style;
    constructor(tagName: string);
    get style(): CSSStyleDeclaration_2;
    attachShadow(_init: ShadowRootInit): RRElement;
    appendChild(newChild: BaseRRNode): BaseRRNode;
    insertBefore(newChild: BaseRRNode, refChild: BaseRRNode | null): BaseRRNode;
    getAttribute(name: string): string | null;
    setAttribute(name: string, attribute: string): void;
    removeAttribute(name: string): void;
    get firstElementChild(): RRElement | null;
    get nextElementSibling(): RRElement | null;
    querySelectorAll(selectors: string): BaseRRNode[];
    getElementById(elementId: string): RRElement | null;
    getElementsByClassName(className: string): RRElement[];
    getElementsByTagName(tagName: string): RRElement[];
}

declare interface RRElementTagNameMap {
    audio: RRMediaElement;
    canvas: RRCanvasElement;
    iframe: RRIFrameElement;
    img: RRImageElement;
    style: RRStyleElement;
    video: RRMediaElement;
}

declare type RRElementType<K extends keyof HTMLElementTagNameMap> = K extends keyof RRElementTagNameMap ? RRElementTagNameMap[K] : RRElement;

export declare class RRIFrameElement extends RRElement {
    width: string;
    height: string;
    src: string;
    contentDocument: RRDocument;
    contentWindow: RRWindow;
    constructor(tagName: string);
}

export declare class RRImageElement extends RRElement {
    src: string;
    width: number;
    height: number;
    onload: ((this: GlobalEventHandlers, ev: Event) => unknown) | null;
}

export declare class RRMediaElement extends BaseRRMediaElement {
}

export declare class RRStyleElement extends RRElement {
    private _sheet;
    get sheet(): CSSStyleSheet | null;
}

export declare class RRText extends BaseRRText {
    readonly nodeName: "#text";
}

export declare class RRWindow {
    scrollLeft: number;
    scrollTop: number;
    scrollTo(options?: ScrollToOptions): void;
}

export { }
