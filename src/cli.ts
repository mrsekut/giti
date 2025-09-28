#!/usr/bin/env bun
import { Command } from 'commander';
import packageJson from '../package.json';
import { cherryCommand } from './commands/cherry.js';
import { rebaseCommand } from './commands/rebase.js';

const program = new Command();

program
  .name('giti')
  .description('Interactive Git CLI for easy commit selection')
  .version(packageJson.version || '0.1.0');

program
  .command('cherry')
  .description('Cherry-pick commits interactively')
  .option('-n, --number <number>', 'Number of commits to show', '30')
  .action(cherryCommand);

program
  .command('rebase')
  .description('Interactive rebase with commit selection')
  .option('-n, --number <number>', 'Number of commits to show', '30')
  .action(rebaseCommand);

program.parse();
