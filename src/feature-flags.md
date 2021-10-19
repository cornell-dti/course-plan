# Feature Flags

## Rationale

To ensure we can deploy to production at any point in time, we need to ensure that the master branch
is always ready for release. Therefore, it cannot contain half-done features. However, we do have to
push incomplete feature to master, otherwise pull requests will be huge.

The solution is to only push incomplete feature to master that has been properly gated. i.e. User
will not be able to see half-done feature by normal interactions with the app. The feature flags and
relevant infrastructure ensures this.

## Implementation

The feature flags are implemented as frontend-only gating via variables in `localStorage`. In
principle, users can change the values themselves and see unreleased features, but they have to do
that through developer console, and we simply cannot not guarantee that your data will never be
corrupted if you choose to do arbitrary stuff in developer console.

The file that contains all gate keepers is in [`feature-flags.ts`](./feature-flags.ts). See the
inline comments in that file to see how to add and use the feature flags.

## Usage

To add a feature flag, add the following line below and keep it alphabetically sorted.

```ts
export const isXyzEnabled = registerFeatureFlagChecker('Xyz');
```

For consistency, the name should be in `PascalCase`.

To check the feature flag in your code, import `isXyzEnabled` from `feature-flags.ts`.

To toggle the feature flag in the app, open developer console and type `GK.enableXyz()` or
`GK.disableXyz()`. You can press tab for autocompletion.
