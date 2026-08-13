# Publishing

This library is published to **GitHub Packages** under the `@fundacja-peryskop` scope. Two audiences care about this document:

- **Maintainers** cutting a new version — see [Cutting a release](#cutting-a-release).
- **Consumers** installing the package in an app — see [Installing the package](#installing-the-package).

---

## Cutting a release

### Prerequisites (one-time)

- Push access to `fundacja-peryskop/ui`.
- Nothing else. The publish workflow uses the built-in `GITHUB_TOKEN` — no PAT to manage.

### The happy path

1. **Bump `version` in `package.json`** on `main` (or in a `chore/release-vX.Y.Z` branch that lands on `main`). Follow SemVer:

   - Patch (`0.0.1` → `0.0.2`) — bug fixes, no behaviour change
   - Minor (`0.0.1` → `0.1.0`) — new components / props, backwards compatible
   - Major (`0.0.1` → `1.0.0`) — breaking prop/API changes

   Commit as `chore(release): vX.Y.Z`.

2. **Push to `main`.** The commit lands normally through the PR process.

3. **Cut a GitHub Release.** In the GitHub UI:

   - Releases → _Draft a new release_
   - Tag: `vX.Y.Z` (must exactly match `package.json` — the workflow verifies this)
   - Target: `main`
   - Title: `vX.Y.Z`
   - Body: high-level changelog (what's new, what's fixed, what breaks)
   - _Publish release_

4. **Watch the workflow run.** `Publish to GitHub Packages` triggers automatically on release publication. It:

   - Runs typecheck, lint, clean, build (via `prepublishOnly`)
   - Verifies `package.json` version matches the release tag
   - Runs `npm publish` against `https://npm.pkg.github.com`

   Green check → the new version is live at `https://github.com/fundacja-peryskop/ui/packages`.

### If the workflow fails

- **Version mismatch** — the release tag and `package.json` version disagree. Fix `package.json`, land on `main`, delete the release, re-cut with the same tag.
- **Lint/typecheck failure** — the release commit shouldn't have shipped. Roll forward with a patch that fixes the lint, bump version, re-release.
- **Transient network error during publish** — trigger `workflow_dispatch` manually (Actions → Publish to GitHub Packages → Run workflow → `main`). No new tag needed.

### Emergency: publishing from your local machine

If GitHub Actions is down and you must ship, from a clean `main`:

```bash
# One-time auth setup (uses a PAT with write:packages scope)
npm login --scope=@fundacja-peryskop --registry=https://npm.pkg.github.com
# username: your GitHub login
# password: your PAT
# email:    your GitHub email

# Publish (runs prepublishOnly automatically → typecheck + lint + build)
npm publish
```

Bump the version + create the tag afterwards so the git history reflects what was shipped.

---

## Installing the package

### One-time setup per developer machine

1. **Create a Personal Access Token** with `read:packages` scope:
   - https://github.com/settings/tokens → _Generate new token (classic)_
   - Select `read:packages` (and only that — narrower is safer)
   - Copy the token immediately (`ghp_…`)

2. **Expose the token as an env var.** Add to `~/.zshrc` / `~/.bashrc` / `~/.profile`:

   ```bash
   export GITHUB_TOKEN=ghp_your_token_here
   ```

   Reload the shell (`exec $SHELL`) so the variable is available to `npm`.

### Per-project setup

Add an `.npmrc` at the root of the consuming project:

```
@fundacja-peryskop:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

The `${GITHUB_TOKEN}` form is safe to commit — npm expands it at install time from the environment, so the literal token never touches the repo. See `.npmrc.example` in this repo for the same template with comments.

### Install

```bash
npm install @fundacja-peryskop/ui
```

Then import as usual:

```tsx
import { Button, Checkbox, List } from '@fundacja-peryskop/ui'
```

Peer dependencies (`react`, `react-native`, `tamagui`) are the consumer's responsibility — install them at the versions declared in `package.json > peerDependencies`.

### CI setup for consuming projects

In GitHub Actions, add `GITHUB_TOKEN` (or a dedicated `PERYSKOP_UI_READ_TOKEN` PAT) to repository secrets, then export it before install:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    registry-url: https://npm.pkg.github.com
    scope: '@fundacja-peryskop'
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Note: the workflow's default `GITHUB_TOKEN` has `read:packages` implicitly when the consumer is in the same organisation as the package. For consumers in a different org, use a PAT.

---

## Version policy

- **`0.x.y`** — pre-1.0 lifecycle. Any minor bump _may_ contain breaking changes. Read the release notes.
- **`1.0.0` onwards** — strict SemVer. Breaking changes only in major bumps.

The version boundary between "unstable" and "stable" is `1.0.0` — do not treat `0.9.x` as stable. Pin narrowly in consuming apps (`~0.5.2` — patch only) until we hit `1.0.0`.
