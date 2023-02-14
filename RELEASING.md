# Releasing shopify-api-js

- Check the Semantic Versioning page for info on how to version the new release: [http://semver.org](http://semver.org)

- The `shopify-api-js` repo uses `changesets` to track and update the `CHANGELOG.md` file.

- When creating a PR, the author should run the `yarn changeset` command, answer the relevant questions (i.e., is it major/minor/patch, what is the change description), and then commit the new file created in the `.changeset` directory. These files are used by the workflows to construct the `CHANGELOG.md` entries.

  > **Note**
  > If the change is very small and doesn't warrant a changelog entry, run `yarn changeset --empty` and commit the resultant file in the `.changeset` directory.

- When the PR is merged into the `main` branch, the `main-release.yml` workflow uses the `changesets/action` to either create or update an existing PR that has the title `Version Packages`. This PR tracks all the changes currently being made against the `main` branch since the last release.

## :exclamation: To perform a release

1. Checkout the `changeset-release/main` branch

   ```shell
   git checkout changeset-release/main
   ```

1. Update the version string in the `lib/version.ts` file to match the version in the `package.json` file.

1. While the branch is checked out, edit/remove any of the comments in the changed `CHANGELOG.md` files and commit them to the `changeset-release/main` branch.

1. Once the files in the PR reflect the desired release changes, merge the `Version Packages` PR into `main` - this triggers the release.

1. The same `changesets/action` in the `main-release.yml` workflow will call `yarn release`, which builds the packages and pushes the changed packages to `npmjs.org`.

---

## Release Candidates

For significant API changes that could result in significant refactoring on the part of developers, consider releasing a few _Release Candidate_ versions in advance of the final version.

> **Warning**
>
> These changes **must** be made against the `next` branch, so that the appropriate workflows can run (`next-release.yml`).

> **Warning**
>
> Before commencing the effort for a batch of release candidates, make sure the `next` branch an identical copy of `main`.

- Prior to creating the first PR against the `next` branch, run the `yarn changeset pre enter rc` command and commit the resultant files from `.changeset`, including the `pre.json` file. This informs `changesets` that it is in pre-release mode, and the pre-release tag is `rc`.

- When creating a PR, the author should run the `yarn changeset` command, answer the relevant questions (i.e., is it major/minor/patch, what is the change description), and then commit the new file created in the `.changeset` directory. These files are used by the workflows to construct the `CHANGELOG.md` entries for the release candidates.

  > **Note**
  > If the change is very small and doesn't warrant a changelog entry, run `yarn changeset --empty` and commit the resultant file in the `.changeset` directory.

- When the PR is merged into the `next` branch, the `next-release.yml` workflow uses the `changesets/action` to either create or update an existing PR that has the title `Version Packages for Release Candidates`.

### :exclamation: To perform a release of release candidate packages

1. Checkout the `changeset-release/next` branch

   ```shell
   git checkout changeset-release/next
   ```

1. Update the version string in the `lib/version.ts` file to match the version in the `package.json` file.

1. While the branch is checked out, edit/remove any of the comments in the changed `CHANGELOG.md` files and commit them to the `changeset-release/next` branch.

1. Once the files in the PR reflect the desired release changes, merge the `Version Packages for Release Candidates (rc)` PR into `next` - this triggers the release.

1. The same `changesets/action` in the `next-release.yml` workflow will call `yarn release`, which builds and pushes the release candidates to `npmjs.org`.

## Merging `next` into `main` (moving from pre-release to main release)

When a major set of changes is about to be mass released from the `next` branch

> **Warning**
>
> The next steps need to be confirmed

1. Checkout the `next` branch

   ```shell
   git checkout next
   ```

1. Take the `next` branch out of pre-release mode by running

   ```shell
   yarn changeset pre exit
   ```

   And commit the changed files.

1. Merge the `next` branch into `main`. This _should_ update the relevant `CHANGELOG.md` files on `main` with the changes from the release candidates.

1. Follow the release procedure outlined [above](#exclamation-to-perform-a-release)
