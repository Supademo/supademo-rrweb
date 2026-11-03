---
'@supademo/rrweb-snapshot': patch
---

Match minified selector lists and combinators in the CSSOM smart merge, so rules Chrome reformats (`#a,#b` to `#a, #b`) are no longer appended a second time after the inline styles.
