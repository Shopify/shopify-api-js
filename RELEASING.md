## Releasing shopify-node-api

1. Check the Semantic Versioning page for info on how to version the new release: http://semver.org

1. Ensure your local repo is up-to-date

   ```
   git checkout main && git pull
   ```

1. Add an entry for the new release to `CHANGELOG.md`, and/or move the contents from the _Unreleased_ to the new release

1. Increment the version in `src/version.ts`.

1. Stage the `CHANGELOG.md` and `src/version.ts` files

   ```
   git add CHANGELOG.md src/version.ts
   ```

1. To update the version, create the appropriate tag, commit all staged changes and push to the remote repository

   ```
   yarn version [ --patch | --minor | --major ]
   ```

   Select the applicable option to the `yarn version` command to increment the appropriate part of the version number, i.e., for a version of `x.y.z`,

   - `--patch` to increment the `z`
   - `--minor` to increment the `y`
   - `--major` to increment the `x`

   The `preversion` and `postversion` scripts in `package.json` take care of the pre (testing) and post (pushing) actions.

1. Login to `shipit` and press Deploy on the appropriate commit (the commit description will be the version number).
