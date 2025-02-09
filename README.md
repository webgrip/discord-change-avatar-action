# Update Discord Avatar / Profile Picture Action

[![Version](https://img.shields.io/badge/version-v1-blue.svg)](https://github.com/webgrip/discord-change-avatar-action/tags)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> [!WARNING]
> **I don't take any responsibility for blocked Discord accounts that used this module.**

> [!CAUTION]
> **Using this on a user account is prohibited by the [Discord TOS](https://discord.com/terms) and can lead to the account block.**

> **Important Disclaimer:**  
> 
> This GitHub Action uses a selfbot (via [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13)) to update a personal Discord profile picture automatically and integrates 2captcha to solve hCaptcha challenges. **Using a selfbot violates Discord’s Terms of Service and may result in account suspension or ban. Use at your own risk!**

## Overview

This repository contains a GitHub Action that logs into your personal Discord account (using your user token) and updates your avatar with an image file provided by you. It automatically solves hCaptcha challenges using the [2captcha](https://2captcha.com/) API.

**Key Features:**

- **Automated Avatar Update:**  
  Updates your Discord profile picture to the image you specify.

- **Captcha Solver Integration:**  
  Automatically solves hCaptcha challenges via the 2captcha API.

- **GitHub Action Ready:**  
  Easily integrate this action into your workflows by referencing it as `@v1`.

- **CI/CD and Versioning:**  
  Includes workflows for building, testing, and auto–bumping versions with a continuously updated `v1` tag.

## Usage

### Inputs

- **`imagePath`** (required):  
  The path (relative to the repository root) to the image that should be used as the new avatar.  
  _Example: `images/new_avatar.png`_

### Required Environment Variables

- **`DISCORD_TOKEN`**:  
  Your personal Discord account token. **Warning:** Using your personal token violates Discord’s Terms of Service.

- **`API_TOKEN_2CAPTCHA`**:  
  Your API key for 2captcha. You can obtain one from [2captcha.com](https://2captcha.com/).

### Action Metadata

The action is defined in the `action.yml` file as follows:

```yaml
name: "Update Discord avatar / profile picture"
author: "Ryan Grippeling <ryan@webgrip.nl>"
runs:
  using: "node20"
  main: "dist/index.js"

inputs:
  imagePath:
    description: "Path to the image that should be used as the new profile picture"
    required: true
```

### Example Workflow

To use this action in your repository, create a workflow file (e.g. `.github/workflows/update-avatar.yml`) with the following content:

```yaml
name: Update Discord Avatar

on:
  workflow_dispatch:

jobs:
  update-avatar:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Update Discord Avatar
        uses: webgrip/discord-change-avatar-action@v1
        with:
          imagePath: "images/new_avatar.png"
        env:
          DISCORD_TOKEN: ${{ secrets.DISCORD_TOKEN }}
          API_TOKEN_2CAPTCHA: ${{ secrets.API_TOKEN_2CAPTCHA }}
```

## Development

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/webgrip/discord-change-avatar-action.git
   cd discord-change-avatar-action
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

### Build

Build the action using [ncc](https://github.com/vercel/ncc):

```bash
npm run build
```

This compiles your source code from `src/main.js` into `dist/index.js`.

### Testing

Tests are written using Jest. Run tests with:

```bash
npm test
```

### Versioning and Releases

- Versioning is managed via `npm version patch`.
- A CI workflow (see below) automatically builds, commits the `dist/` folder, bumps the version, and (if the major version is 1) updates the `v1` tag.
- This allows you to reference the action with `@v1` in workflows so that minor and patch updates are automatically tracked.

## CI/CD Workflow

The CI workflow (`.github/workflows/build-and-commit-dist.yml`) performs the following steps:

1. **Checks out** the repository with full history.
2. **Installs dependencies** and runs tests.
3. **Builds** the action (bundles source code into `dist/`).
4. **Commits** the updated `dist/` directory.
5. **Bumps the version** (using `npm version patch`).
6. **Pushes** the changes.
7. **Updates the `v1` tag** if the major version is 1.

A sample workflow is provided in the repository.

## Security & Compliance Warning

- **Selfbots Violate Discord’s TOS:**  
  This action logs into your personal account and uses a selfbot to update your avatar. Discord prohibits automated use of user tokens, and using this action may result in account suspension or banning.

- **Token Security:**  
  Ensure that your tokens (`DISCORD_TOKEN` and `API_TOKEN_2CAPTCHA`) are stored securely as GitHub Secrets.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or issues, please open an issue in this repository or contact Ryan Grippeling at [ryan@webgrip.nl](mailto:ryan@webgrip.nl).
