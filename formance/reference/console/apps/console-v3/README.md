# Console-v3

## Development

Run the dev server:

```shellscript
pnpm dev
```

## Deployment

First, build your app for production:

```sh
pnpm build
```

Then run the app in production mode:

```sh
pnpm start:prod
```

## Feature flag

Features can be disabled by setting one or more of the feature string into FEATURES_DISABLED env var. String must be
separated by a comma.

List can be found inside `app/hooks/useFeatureFlag.ts` (`enum FEATURES`)

Note that if `FEATURES_DISABLED` is not given, all features will be enabled.

## Gateway services

Gateway services can be mock on MICRO_STACK=1 by setting one or more services versions. Ex
`SERVICES_VERSION='{"ledger":"1","payment":"2"}'`

Note that if `SERVICES_VERSION` is not given, no versions will be given.
