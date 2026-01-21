const prompts = require('prompts');
const fs = require('fs');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

const API_URL = 'https://longcc.the-ppc-geek.org/api/sessions';
const HOOK_FILENAME = 'claude-autonomy-hook.sh';

async function runSetup() {
  console.log(chalk.blue.bold('\n🚀 Claude Code Autonomy Tracker - Setup\n'));

  // Step 1: Get username
  const { username } = await prompts({
    type: 'text',
    name: 'username',
    message: 'Enter your username for the leaderboard:',
    validate: value => value.length > 0 ? true : 'Username is required'
  });

  if (!username) {
    console.log(chalk.red('Setup cancelled.'));
    process.exit(1);
  }

  // Step 2: Choose installation location
  const homeDir = os.homedir();
  const defaultHookDir = path.join(homeDir, '.claude', 'hooks');

  const { hookDir } = await prompts({
    type: 'text',
    name: 'hookDir',
    message: 'Where should the hook be installed?',
    initial: defaultHookDir
  });

  if (!hookDir) {
    console.log(chalk.red('Setup cancelled.'));
    process.exit(1);
  }

  // Step 3: Read template and replace placeholders
  const templatePath = path.join(__dirname, '..', 'templates', 'hook-template.sh');
  let hookContent = fs.readFileSync(templatePath, 'utf8');

  // Replace placeholders with actual values
  hookContent = hookContent.replace(
    'USERNAME="${CLAUDE_TRACKER_USERNAME:-your-username-here}"',
    'USERNAME="${CLAUDE_TRACKER_USERNAME:-' + username + '}"'
  );
  hookContent = hookContent.replace(
    'API_URL="${CLAUDE_TRACKER_API_URL:-https://longcc.the-ppc-geek.org/api/sessions}"',
    'API_URL="${CLAUDE_TRACKER_API_URL:-' + API_URL + '}"'
  );

  // Step 4: Create hook directory if it doesn't exist
  if (!fs.existsSync(hookDir)) {
    fs.mkdirSync(hookDir, { recursive: true });
    console.log(chalk.green(`✓ Created directory: ${hookDir}`));
  }

  // Step 5: Write hook file
  const hookPath = path.join(hookDir, HOOK_FILENAME);
  fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });
  console.log(chalk.green(`✓ Hook installed to: ${hookPath}`));

  // Step 6: Set environment variable
  console.log(chalk.blue('\n📝 Configuration:\n'));
  console.log(`Username: ${chalk.cyan(username)}`);
  console.log(`API URL:  ${chalk.cyan(API_URL)}`);
  console.log(`Hook:     ${chalk.cyan(hookPath)}`);

  // Step 7: Show next steps
  console.log(chalk.blue.bold('\n📋 Next Steps:\n'));
  console.log(`1. Add this to your shell profile (${chalk.cyan('~/.bashrc')} or ${chalk.cyan('~/.zshrc')}):`);
  console.log(chalk.yellow(`   export CLAUDE_TRACKER_USERNAME="${username}"`));
  console.log('\n2. Configure Claude Code to use this hook:');
  console.log(chalk.yellow(`   Add "${hookPath}" to your Claude Code hooks configuration`));
  console.log('\n3. Restart your shell or run:');
  console.log(chalk.yellow(`   source ~/.bashrc  # or ~/.zshrc`));

  console.log(chalk.green.bold('\n✨ Setup complete! Your sessions will now be tracked automatically.\n'));
  console.log(chalk.dim(`View leaderboard: ${API_URL.replace('/api/sessions', '')}\n`));
}

function showHelp() {
  console.log(`
${chalk.blue.bold('Claude Code Autonomy Tracker')}

${chalk.bold('USAGE:')}
  claude-hook <command>

${chalk.bold('COMMANDS:')}
  setup      Interactive setup - configure your username and install the hook
  help       Show this help message
  version    Show version information

${chalk.bold('EXAMPLES:')}
  $ claude-hook setup
  $ claude-hook help

${chalk.bold('DOCUMENTATION:')}
  https://github.com/krellgit/claude-autonomy-tracker
  https://longcc.the-ppc-geek.org

${chalk.bold('WHAT IT DOES:')}
  Tracks autonomous work periods in Claude Code - the time between when you
  send a message and your next message. Automatically submits sessions to the
  global leaderboard.
`);
}

module.exports = { runSetup, showHelp };
