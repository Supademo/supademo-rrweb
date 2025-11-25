---
"@supademo/rrweb-snapshot": patch
---

Add Smart Merge CSS Strategy for better CSS capture

- Preserves CSS variables and shorthand properties by using textContent as the primary source
- Captures dynamically added CSSOM rules (via insertRule) and appends them with a marker comment
- Fixes issues where background shorthand properties were expanded to longhand
- Fixes issues where CSS custom properties (variables) were lost during serialization
- Adds comprehensive edge case tests for CSS capture scenarios
