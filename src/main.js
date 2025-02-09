const core = require('@actions/core');
const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');
const captcha = require('2captcha');

async function run() {
  try {
    const discordToken = process.env.DISCORD_TOKEN;
    if (!discordToken) {
      throw new Error('Missing DISCORD_TOKEN environment variable.');
    }

    core.debug(`[DEBUG] Using token length: ${discordToken.length} (masked)`);

    const captchaSolverToken = process.env.API_TOKEN_2CAPTCHA;
    if (!captchaSolverToken) {
      throw new Error('Missing API_TOKEN_2CAPTCHA environment variable.');
    }

    const imagePath = core.getInput('imagePath', { required: true });
    core.debug(`Requested imagePath: ${imagePath}`);

    const fullPath = path.join(process.env.GITHUB_WORKSPACE || '', imagePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Image file not found at: ${fullPath}`);
    }

    const fileData = fs.readFileSync(fullPath);
    const base64Image = `data:image/png;base64,${fileData.toString('base64')}`;

    core.debug(`Successfully read image file. Size: ${fileData.length} bytes`);

    const solver = new captcha.Solver(captchaSolverToken);

    const client = new Client({
      captchaSolver: function(captcha, UA) {
        return solver
            .hcaptcha(
                captcha.captcha_sitekey,
                'discord.com',
                {
                  invisible: 1,
                  userAgent: UA,
                  data: captcha.captcha_rqdata
                }
            ).then(res => res.data);
      },
    });

    client.on('ready', async () => {
      core.debug(`Logged in as: ${client.user?.tag} - Attempting to update avatar...`);

      try {
        await client.user?.setAvatar(base64Image);
        core.info("Avatar updated successfully!");
      } catch (error) {
        core.setFailed(`Failed to update avatar: ${error.message}`);
      } finally {
        client.destroy();
      }
    });

    await client.login(discordToken);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
