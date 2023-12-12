---
"@shopify/shopify-api": major
---

Rephrased `gdprTopics` to `privacyTopics` to account for other privacy regulations with data subject requests.

This changes the name of the exported object.
You can fix this by changing your `import` statements:

Before:

```ts
import {gdprTopics} from '@shopify/shopify-api';
```

After:

```ts
import {privacyTopics} from '@shopify/shopify-api';
```
