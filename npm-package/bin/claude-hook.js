#!/usr/bin/env node

const { runSetup, showHelp } = require('../lib/setup');

const command = process.argv[2];

async function main() {
  switch (command) {
    case 'setup':
      await runSetup();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    case 'version':
    case '--version':
    case '-v':
      const pkg = require('../package.json');
      console.log(`claude-autonomy-hook v${pkg.version}`);
      break;
    default:
      console.log('Unknown command. Run "claude-hook help" for usage information.');
      process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
