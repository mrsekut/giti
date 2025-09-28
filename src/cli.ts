#!/usr/bin/env node
import { Command } from '@effect/cli';
import { BunContext, BunRuntime } from '@effect/platform-bun';
import { Console, Effect } from 'effect';
import { cherryPickCommand } from './commands/cherry-pick.js';
import { rebaseCommand } from './commands/rebase.js';

const giti = Command.make('giti', {}, () => Console.log('Git Interactive CLI'));

const cherry = Command.make('cherry-pick', {}, () => cherryPickCommand());
const rebase = Command.make('rebase', {}, () => rebaseCommand());

const command = giti.pipe(Command.withSubcommands([cherry, rebase]));

const cli = Command.run(command, {
  name: 'giti',
  version: 'v1.0.0',
});

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
