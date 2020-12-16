## Releasing shopify_ts_api

1. Check the Semantic Versioning page for info on how to version the new release: http://semver.org

1. Ensure your local repo is up-to-date
   ```
   git checkout master && git pull
   ```

1. Create a branch named `release_X_Y_Z` (replacing `X_Y_Z` with the intended release version)
   ```
   $ git checkout -b release_X_Y_Z
   ```

1. Make sure all of the tests are passing and the code isn't breaking
   ```
   yarn test && yarn lint
   ```

1. Add an entry for the new release to `CHANGELOG.md`, and/or move the contents from the *Unreleased* to the new release

1. Increment the version in `package.json` and `src/version.ts`.

1. Commit the changes with a commit message like "Packaging for release X.Y.Z"
   ```
   $ git commit -am "Packaging for release vX.Y.Z"
   ```

1. Push out the changes
   ```
   $ git push -u origin release_X_Y_Z
   ```

1. Open a PR for the branch, get necessary approvals from code owners and merge into main branch. Note that the PR title will be the release note in Shipit, so make sure it mentions the release

1. Login to `shipit` and press Deploy on the appropriate commit (the commit description will be the version number).
