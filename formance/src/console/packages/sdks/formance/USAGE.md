<!-- Start SDK Example Usage [usage] -->
```typescript
import { SDK } from "openapi";

const sdk = new SDK({
    security: {
        clientID: "",
    },
});

async function run() {
    const result = await sdk.getVersions();

    // Handle the result
    console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->