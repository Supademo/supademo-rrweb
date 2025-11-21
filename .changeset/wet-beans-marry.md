---
"@supademo/rrweb-snapshot": patch
---

Capture Web Animations API state during snapshot serialization. Elements animated using element.animate() now have their current computed style values merged into the style attribute, preserving the exact visual state at snapshot time without requiring animation replay logic
