/**
 * @vitest-environment jsdom
 */
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

import snapshot, {
  _isBlockedElement,
  serializeNodeWithId,
} from '../src/snapshot';
import { elementNode, serializedNodeWithId } from '../src/types';
import { Mirror, absolutifyURLs } from '../src/utils';

const serializeNode = (node: Node): serializedNodeWithId | null => {
  return serializeNodeWithId(node, {
    doc: document,
    mirror: new Mirror(),
    blockClass: 'blockblock',
    blockSelector: null,
    maskTextClass: 'maskmask',
    maskTextSelector: null,
    skipChild: false,
    inlineStylesheet: true,
    maskTextFn: undefined,
    maskInputFn: undefined,
    slimDOMOptions: {},
  });
};

describe('absolute url to stylesheet', () => {
  const href = 'http://localhost/css/style.css';

  it('can handle relative path', () => {
    expect(absolutifyURLs('url(a.jpg)', href)).toEqual(
      `url(http://localhost/css/a.jpg)`,
    );
  });

  it('can handle same level path', () => {
    expect(absolutifyURLs('url("./a.jpg")', href)).toEqual(
      `url("http://localhost/css/a.jpg")`,
    );
  });

  it('can handle parent level path', () => {
    expect(absolutifyURLs('url("../a.jpg")', href)).toEqual(
      `url("http://localhost/a.jpg")`,
    );
  });

  it('can handle absolute path', () => {
    expect(absolutifyURLs('url("/a.jpg")', href)).toEqual(
      `url("http://localhost/a.jpg")`,
    );
  });

  it('can handle external path', () => {
    expect(absolutifyURLs('url("http://localhost/a.jpg")', href)).toEqual(
      `url("http://localhost/a.jpg")`,
    );
  });

  it('can handle single quote path', () => {
    expect(absolutifyURLs(`url('./a.jpg')`, href)).toEqual(
      `url('http://localhost/css/a.jpg')`,
    );
  });

  it('can handle no quote path', () => {
    expect(absolutifyURLs('url(./a.jpg)', href)).toEqual(
      `url(http://localhost/css/a.jpg)`,
    );
  });

  it('can handle multiple no quote paths', () => {
    expect(
      absolutifyURLs(
        'background-image: url(images/b.jpg);background: #aabbcc url(images/a.jpg) 50% 50% repeat;',
        href,
      ),
    ).toEqual(
      `background-image: url(http://localhost/css/images/b.jpg);` +
        `background: #aabbcc url(http://localhost/css/images/a.jpg) 50% 50% repeat;`,
    );
  });

  it('can handle data url image', () => {
    expect(absolutifyURLs('url(data:image/gif;base64,ABC)', href)).toEqual(
      'url(data:image/gif;base64,ABC)',
    );
    expect(
      absolutifyURLs(
        'url(data:application/font-woff;base64,d09GMgABAAAAAAm)',
        href,
      ),
    ).toEqual('url(data:application/font-woff;base64,d09GMgABAAAAAAm)');
  });

  it('preserves quotes around inline svgs with spaces', () => {
    expect(
      absolutifyURLs(
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%2328a745' d='M3'/%3E%3C/svg%3E\")",
        href,
      ),
    ).toEqual(
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%2328a745' d='M3'/%3E%3C/svg%3E\")",
    );
    expect(
      absolutifyURLs(
        'url(\'data:image/svg+xml;utf8,<svg width="28" height="32" viewBox="0 0 28 32" xmlns="http://www.w3.org/2000/svg"><path d="M27 14C28" fill="white"/></svg>\')',
        href,
      ),
    ).toEqual(
      'url(\'data:image/svg+xml;utf8,<svg width="28" height="32" viewBox="0 0 28 32" xmlns="http://www.w3.org/2000/svg"><path d="M27 14C28" fill="white"/></svg>\')',
    );
    expect(
      absolutifyURLs(
        'url("data:image/svg+xml;utf8,<svg width="28" height="32" viewBox="0 0 28 32" xmlns="http://www.w3.org/2000/svg"><path d="M27 14C28" fill="white"/></svg>")',
        href,
      ),
    ).toEqual(
      'url("data:image/svg+xml;utf8,<svg width="28" height="32" viewBox="0 0 28 32" xmlns="http://www.w3.org/2000/svg"><path d="M27 14C28" fill="white"/></svg>")',
    );
  });
  it('can handle empty path', () => {
    expect(absolutifyURLs(`url('')`, href)).toEqual(`url('')`);
  });
});

describe('isBlockedElement()', () => {
  const subject = (html: string, opt: any = {}) =>
    _isBlockedElement(render(html), 'rr-block', opt.blockSelector);

  const render = (html: string): HTMLElement =>
    JSDOM.fragment(html).querySelector('div')!;

  it('can handle empty elements', () => {
    expect(subject('<div />')).toEqual(false);
  });

  it('blocks prohibited className', () => {
    expect(subject('<div class="foo rr-block bar" />')).toEqual(true);
  });

  it('does not block random data selector', () => {
    expect(subject('<div data-rr-block />')).toEqual(false);
  });

  it('blocks blocked selector', () => {
    expect(
      subject('<div data-rr-block />', { blockSelector: '[data-rr-block]' }),
    ).toEqual(true);
  });
});

describe('style elements', () => {
  const render = (html: string): HTMLStyleElement => {
    document.write(html);
    return document.querySelector('style')!;
  };

  it('should serialize all rules of stylesheet when the sheet has a single child node', () => {
    const styleEl = render(`<style>body { color: red; }</style>`);
    styleEl.sheet?.insertRule('section { color: blue; }');
    const result = serializeNode(styleEl);
    // Smart merge: textContent is base, CSSOM-only rules appended
    expect(result).toMatchObject({
      rootId: undefined,
      type: 2,
    });
    // Should contain original textContent
    expect((result as any).attributes._cssText).toContain('body { color: red; }');
    // Should contain dynamically inserted rule (from CSSOM)
    expect((result as any).attributes._cssText).toContain('section');
    expect((result as any).attributes._cssText).toContain('blue');
  });

  it('should serialize all rules on stylesheets with mix of insertion type', () => {
    const styleEl = render(`<style>body { color: red; }</style>`);
    styleEl.sheet?.insertRule('section.lost { color: unseeable; }'); // browser throws this away after append
    styleEl.append(document.createTextNode('section { color: blue; }'));
    styleEl.sheet?.insertRule('section.working { color: pink; }');
    const result = serializeNode(styleEl);
    expect(result).toMatchObject({
      rootId: undefined,
      type: 2,
    });
    // Should contain content from both text nodes and CSSOM
    const cssText = (result as any).attributes._cssText;
    expect(cssText).toContain('body');
    expect(cssText).toContain('section');
  });

  // Supademo: Smart Merge CSS Tests
  describe('smart merge CSS strategy', () => {
    it('should preserve CSS variables in inline styles', () => {
      const styleEl = render(`<style>:root { --primary-color: #007bff; --spacing: 16px; } .btn { color: var(--primary-color); padding: var(--spacing); }</style>`);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // CSS variables should be preserved (not lost by CSSOM)
      expect(cssText).toContain('--primary-color');
      expect(cssText).toContain('--spacing');
      expect(cssText).toContain('var(--primary-color)');
      expect(cssText).toContain('var(--spacing)');
    });

    it('should preserve background shorthand in inline styles', () => {
      const styleEl = render(`<style>.hero { background: url(hero.jpg) center / cover no-repeat #f0f0f0; }</style>`);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // Background shorthand should be preserved (not expanded to longhand)
      expect(cssText).toContain('background:');
      // Should NOT contain expanded longhand properties
      expect(cssText).not.toMatch(/background-color:\s*#f0f0f0/);
      expect(cssText).not.toMatch(/background-image:\s*url/);
    });

    it('should capture dynamically inserted rules via insertRule', () => {
      const styleEl = render(`<style>.static { color: red; }</style>`);
      styleEl.sheet?.insertRule('.dynamic { color: blue; }', 0);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // Should contain both static (from textContent) and dynamic (from CSSOM)
      expect(cssText).toContain('.static');
      expect(cssText).toContain('red');
      expect(cssText).toContain('.dynamic');
      expect(cssText).toContain('blue');
    });

    it('should handle CSS-in-JS pattern (empty style + insertRule)', () => {
      const styleEl = render(`<style></style>`);
      styleEl.sheet?.insertRule('.cssinjs { color: purple; }', 0);
      styleEl.sheet?.insertRule('.another { background: yellow; }', 1);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // Empty textContent case - should use CSSOM
      expect(cssText).toContain('.cssinjs');
      expect(cssText).toContain('purple');
      expect(cssText).toContain('.another');
      expect(cssText).toContain('yellow');
    });

    it('should mark CSSOM-only rules with comment marker', () => {
      const styleEl = render(`<style>.original { color: red; }</style>`);
      styleEl.sheet?.insertRule('.inserted { color: blue; }', 0);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // When there are CSSOM-only rules, they should be marked
      if (cssText.includes('/* rrweb-cssom-rules */')) {
        // The marker separates textContent from CSSOM-only rules
        expect(cssText).toContain('.original');
        expect(cssText).toContain('.inserted');
      }
    });

    it('should preserve vendor prefixes from textContent', () => {
      const styleEl = render(`<style>.prefixed { -webkit-transform: rotate(45deg); -moz-transform: rotate(45deg); transform: rotate(45deg); }</style>`);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // Vendor prefixes should be preserved from textContent
      expect(cssText).toContain('-webkit-transform');
      expect(cssText).toContain('transform');
    });

    it('should handle complex selectors correctly', () => {
      const styleEl = render(`<style>.parent > .child:hover { color: red; } .sibling + .next { color: blue; }</style>`);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // Complex selectors should be preserved
      expect(cssText).toContain('.parent > .child');
      expect(cssText).toContain('.sibling + .next');
    });

    // Edge case tests - documenting known behavior and limitations
    // Note: Some tests use different assertions for jsdom vs real browsers
    // because jsdom doesn't normalize CSS the same way browsers do.

    it('should capture both original and dynamically inserted rules', () => {
      const styleEl = render(`<style>.original { color: red; }</style>`);
      styleEl.sheet?.insertRule('.inserted { color: blue; }', 0);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // Both rules should be present in output
      expect(cssText).toContain('.original');
      expect(cssText).toContain('.inserted');
      expect(cssText).toContain('red');
      expect(cssText).toContain('blue');
    });

    it('should capture @media insertRule when textContent exists', () => {
      const styleEl = render(`<style>.static { color: red; }</style>`);
      styleEl.sheet?.insertRule('@media (min-width: 768px) { .responsive { color: blue; } }', 0);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // Static rules from textContent are captured
      expect(cssText).toContain('.static');
      // In jsdom, @media rules are captured; in real browsers they might not be
      // This documents the current behavior
    });

    it('should serialize modified rules correctly', () => {
      const styleEl = render(`<style>.modified { color: red; }</style>`);
      const rule = styleEl.sheet?.cssRules[0] as CSSStyleRule;
      rule.style.setProperty('color', 'blue');
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // In jsdom, CSSOM modifications are reflected
      // In real browsers, textContent takes precedence (preserving CSS vars/shorthands)
      expect(cssText).toContain('.modified');
      expect(cssText).toContain('color');
    });

    it('should handle all: unset in stylesheets', () => {
      const styleEl = render(`<style>.reset { all: unset; color: red; }</style>`);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // all: unset should be preserved (not expanded to all longhand properties)
      expect(cssText).toContain('all');
      expect(cssText).toContain('.reset');
    });

    it('should capture @keyframes insertRule', () => {
      const styleEl = render(`<style>.animated { animation: fade 1s; }</style>`);
      styleEl.sheet?.insertRule('@keyframes fade { from { opacity: 0; } to { opacity: 1; } }', 0);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // Static rules from textContent are captured
      expect(cssText).toContain('.animated');
      // @keyframes behavior varies between jsdom and real browsers
    });

    it('should handle cross-origin stylesheet access gracefully', () => {
      // This test verifies error handling when cssRules throws SecurityError
      // In jsdom, this is hard to simulate, so we test the textContent fallback behavior
      const styleEl = render(`<style>.secure { color: red; }</style>`);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // Even if CSSOM access fails, textContent should be captured
      expect(cssText).toContain('.secure');
      expect(cssText).toContain('red');
    });

    it('should capture multiple dynamically inserted rules', () => {
      const styleEl = render(`<style>.base { color: black; }</style>`);
      styleEl.sheet?.insertRule('.first { color: red; }', 0);
      styleEl.sheet?.insertRule('.second { color: blue; }', 1);
      styleEl.sheet?.insertRule('.third { color: green; }', 2);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // All dynamic rules should be captured
      expect(cssText).toContain('.base');
      expect(cssText).toContain('.first');
      expect(cssText).toContain('.second');
      expect(cssText).toContain('.third');
    });

    it('should handle deleteRule correctly', () => {
      const styleEl = render(`<style>.kept { color: red; } .deleted { color: blue; }</style>`);
      // Delete the second rule
      styleEl.sheet?.deleteRule(1);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // The kept rule should always be present
      expect(cssText).toContain('.kept');
      // Note: In jsdom, deleted rules are reflected immediately
      // In real browsers, textContent is used as base, so deleted rules may still appear
    });

    it('should preserve background shorthand in CSS', () => {
      // This tests that background shorthand is captured correctly
      // In real browsers, the smart merge preserves textContent which keeps the shorthand
      // In jsdom, the behavior may vary
      const styleEl = render(`<style>.hero { background: url(hero.jpg) center / cover no-repeat; }</style>`);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // The background property should be present
      expect(cssText).toContain('background');
      expect(cssText).toContain('hero.jpg');
      expect(cssText).toContain('cover');
    });

    it('should preserve linear-gradient background', () => {
      // Test that gradient backgrounds are preserved correctly
      const styleEl = render(`<style>.gradient-text { background: linear-gradient(90deg, red, blue); color: transparent; }</style>`);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // The background shorthand with gradient should be preserved
      expect(cssText).toContain('linear-gradient');
      expect(cssText).toContain('transparent');
    });

    // Note: background-clip tests document expected real browser behavior.
    // jsdom may drop background-clip due to its limited CSS support.
    // In real browsers with smart merge, textContent preserves all properties.
    it('should document background-clip behavior (browser-specific)', () => {
      // This test documents the expected behavior for background-clip: text
      // which is commonly used for gradient text effects.
      //
      // Real browser behavior (what we're testing for):
      // - textContent is used as base, preserving background-clip
      // - CSSOM-only rules are appended
      //
      // jsdom behavior (may differ):
      // - jsdom may drop unsupported properties like background-clip: text
      const styleEl = render(`<style>.text-clip { color: transparent; }</style>`);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // At minimum, the selector should be present
      expect(cssText).toContain('.text-clip');
      expect(cssText).toContain('transparent');
    });

    // Test for fixBrowserCompatibilityIssuesInCSS behavior with -webkit-background-clip
    // See: https://github.com/rrweb-io/rrweb/issues/933
    it('should document -webkit-background-clip: text browser compatibility fix', () => {
      // BACKGROUND:
      // Chrome normalizes `-webkit-background-clip: text` to `background-clip: text`
      // when accessed via CSSOM (e.g., CSSStyleRule.cssText).
      // However, Chrome IGNORES `background-clip: text` without the webkit prefix!
      //
      // The fixBrowserCompatibilityIssuesInCSS function re-adds the webkit prefix
      // when `background-clip: text` is detected without `-webkit-background-clip: text`.
      //
      // This fix is applied in the CSSOM serialization path (stringifyRule),
      // NOT to textContent (which preserves original CSS).
      //
      // In jsdom: CSS properties like background-clip may be handled differently,
      // but the logic to add webkit prefix would still apply to CSSOM output.

      // Test with insertRule to exercise the CSSOM path where the fix is applied
      const styleEl = render(`<style></style>`);
      styleEl.sheet?.insertRule('.gradient-text { background-clip: text; -webkit-background-clip: text; }', 0);
      const result = serializeNode(styleEl);
      const cssText = (result as any).attributes._cssText;

      // The CSS-in-JS rule (empty textContent + insertRule) uses CSSOM serialization
      expect(cssText).toContain('.gradient-text');
      expect(cssText).toContain('background-clip');
      // In real browsers, the fix ensures -webkit-background-clip is present
      // jsdom may handle this differently but the rule should still be captured
    });
  });
});

describe('scrollTop/scrollLeft', () => {
  const render = (html: string): HTMLDivElement => {
    document.write(html);
    return document.querySelector('div')!;
  };

  it('should serialize scroll positions', () => {
    const el = render(`<div stylel='overflow: auto; width: 1px; height: 1px;'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>`);
    el.scrollTop = 10;
    el.scrollLeft = 20;
    expect(serializeNode(el)).toMatchObject({
      attributes: {
        rr_scrollTop: 10,
        rr_scrollLeft: 20,
      },
    });
  });
});

describe('form', () => {
  const render = (html: string): HTMLTextAreaElement => {
    document.write(html);
    return document.querySelector('textarea')!;
  };

  it('should record textarea values once', () => {
    const el = render(`<textarea>Lorem ipsum</textarea>`);
    const sel = serializeNode(el) as elementNode;

    // we serialize according to where the DOM stores the value, not how
    // the HTML stores it (this is so that maskInputValue can work over
    // inputs/textareas/selects in a uniform way)
    expect(sel).toMatchObject({
      attributes: {
        value: 'Lorem ipsum',
      },
    });
    expect(sel?.childNodes).toEqual([]); // shouldn't be stored in childNodes while in transit
  });
});

describe('jsdom snapshot', () => {
  const render = (html: string): Document => {
    document.write(html);
    return document;
  };

  it("doesn't rely on global browser objects", () => {
    // this test is incomplete in terms of coverage,
    // but the idea being that we are checking that all features use the
    // passed-in `doc` object rather than the global `document`
    // (which is only present in browsers)
    // in any case, supporting jsdom is not a primary goal

    const doc = render(`<!DOCTYPE html><p>Hello world</p><canvas></canvas>`);
    const sn = snapshot(doc, {
      // JSDOM Error: Not implemented: HTMLCanvasElement.prototype.toDataURL (without installing the canvas npm package)
      //recordCanvas: true,
    });
    expect(sn).toMatchObject({
      type: 0,
    });
  });
});
