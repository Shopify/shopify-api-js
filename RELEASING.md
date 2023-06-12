# Releasing shopify-api-js

## General overview of the release process

The `shopify-api-js` repo uses `changesets` to track and update the `CHANGELOG.md` file, as well as to publish to NPM.

### For fixes and new functionality that are being published _without_ using any release candidates

  1. The developer creates a branch with their change using `main` as the base branch, opens a PR to obtain the necessary feedback, makes any required updates and obtains approval from the maintainers.

  1. The developer merges their PR, which merges their branch into `main`. This triggers the `main-release.yml` workflow.

  1. The `main-release.yml` workflow will create a branch called `changeset-release/main` and a corresponding PR called `Packages for release` (or update the branch and PR if they already exist). This branch/PR contains the necessary updates to the `CHANGELOG.md` file that will be included in the release, as well as any updates (e.g., version) to the `package.json` file.

  1. When ready to release, merging the `Packages for release` PR will update `main` with the contents of the `changeset-release/main` branch, and will automatically publish the package(s) to NPM.

### If release candidates are used to obtain feedback from the community prior to an upcoming release

  1. Prior to the development of breaking changes (for which pre-releases are being used), the `release-candidate` branch is created from `main` and put into _pre-release_ mode using the `yarn changeset` command (see details in the [release candidates](#release-candidates) section below).

  1. The developer creates a branch with their change using `release-candidate` as the base branch, obtains the necessary feedback, makes any required updates and obtains approval from the maintainers.

  1. The developer merges their PR, which merges their branch into `release-candidate`. This triggers the `release-candidate.yml` workflow.

  1. The `release-candidate.yml` workflow will create a branch called `changeset-release/release-candidate` and a corresponding PR called `Packages for release-candidate (rc)` (or update the branch and PR if they already exist).  This branch/PR contains the necessary updates to the `CHANGELOG.md` file that will be included in the release candidate, as well as any updates (e.g., version) to the `package.json` file.

  1. When ready to publish the release candidate, merging the `Packages for release-candidate (rc)` PR will update the `release-candidate` branch with the contents of the `changeset-release/release-candidate` branch, and will automatically publish the release candidate package(s) to NPM.

  1. When ready to publish as the next general release, the `release-candidate` branch is taken out of _pre-release_ mode using the `yarn changeset` command (see details in the [release candidates](#release-candidates) section below).

  1. Create a PR to merge the `release-candidate` branch into `main` and proceed as per the [general release process above](#for-fixes-and-new-functionality-that-are-being-published-without-using-any-release-candidates)

See the sections below for specific details related to the steps outlined above.

---

## Notes before releasing

- Check the Semantic Versioning page for info on how to version the new release: [http://semver.org](http://semver.org)

- When creating a PR, the author should run the `yarn changeset` command, answer the relevant questions (i.e., is it major/minor/patch, what is the change description), then add and commit the new file tht was created in the `.changeset` directory. These files are used by the workflows to construct the `CHANGELOG.md` entries.

  > **Note**
  > If the change is very small and doesn't warrant a changelog entry, run `yarn changeset --empty` and commit the resultant file in the `.changeset` directory.

---

## :exclamation: To perform a release

1. Checkout the `changeset-release/main` branch

   ```shell
   git checkout changeset-release/main
   ```

1. Update the version string in the `lib/version.ts` file to match the version in the `package.json` file in this branch.

1. If needed, edit/remove any of the comments in the `CHANGELOG.md` files and commit them to the `changeset-release/main` branch.

1. Once the files in the PR reflect the desired release changes, merge the `Packages for release` PR into `main` - this triggers the release.

1. The same `changesets/action` in the `main-release.yml` workflow will call `yarn release`, which builds the packages and pushes the changed packages to `npmjs.org`.

1. After the release, there will no longer be a `Packages for release` PR.  `changesets` will re-create it when a branch that contains `changesets`-created changelog files is merged into `main`.

---

## Release Candidates

For significant API changes that could result in significant refactoring on the part of developers, consider releasing a few _Release Candidate_ versions in advance of the final version.

> **Warning**
>
> These changes **must** be made against the `release-candidate` branch, so that the appropriate workflows can run (`release-candidate.yml`).

> **Warning**
>
> Before commencing the effort for a batch of release candidates, make sure the `release-candidate` branch an identical copy of `main`.

- Prior to creating the first PR against the `release-candidate` branch, run the `yarn changeset pre enter rc` command and commit the resultant files from `.changeset`, including the `pre.json` file. This informs `changesets` that it is in pre-release mode, and that the pre-release tag is `rc`.

- When creating a PR, the author should run the `yarn changeset` command, answer the relevant questions (i.e., is it major/minor/patch, what is the change description), and then commit the new file created in the `.changeset` directory. These files are used by the workflows to construct the `CHANGELOG.md` entries for the release candidates.

  > **Note**
  > If the change is very small and doesn't warrant a changelog entry, run `yarn changeset --empty` and commit the resultant file in the `.changeset` directory.

- When the PR is merged into the `release-candidate` branch, the `release-candidate.yml` workflow uses the `changesets/action` to either create or update an existing PR that has the title `Packages for release-candidate (rc)`.

### :exclamation: To perform a release of release candidate packages

1. Checkout the `changeset-release/release-candidate` branch

   ```shell
   git checkout changeset-release/release-candidate
   ```

1. Update the version string in the `lib/version.ts` file to match the version in the `package.json` file. Make sure to add an `-rc.X` to the version, like so:

   ```text
   7.0.0-rc.1
   ```

1. If needed, edit/remove any of the comments in the changed `CHANGELOG.md` files and commit them to the `changeset-release/release-candidate` branch.

1. Once the files in the PR reflect the desired release changes, merge the `Packages for release-candidate (rc)` PR into `release-candidate` - this triggers the release.

1. The same `changesets/action` in the `release-candidate.yml` workflow will call `yarn release`, which builds and pushes the release candidates to `npmjs.org`.

1. After the release, there will no longer be a `Packages for release-candidate (rc)` PR.  `changesets` will re-create it when a branch that contains `changesets`-created changelog files is merged into `release-candidate`.

## Merging `release-candidate` into `main` (moving from pre-release to main release)

When a major set of changes is about to be mass released from the `release-candidate` branch

> **Warning**
>
> The next steps need to be confirmed

1. Checkout the `release-candidate` branch

   ```shell
   git checkout release-candidate
   ```

1. Take the `release-candidate` branch out of pre-release mode by running

   ```shell
   yarn changeset pre exit
   ```

   And commit the changed files.

1. Create a PR to merge the `release-candidate` branch into `main`.

1. Once that PR is merged, follow the [to perform a release](#exclamation-to-perform-a-release) outlined above.
