import { Command } from '@effect/cli';
import { BunContext, BunRuntime } from '@effect/platform-bun';
import { Console, Effect } from 'effect';
import { cherryCommand } from './commands/cherry';
import { rebaseCommand } from './commands/rebase';

const giti = Command.make('giti', {}, () => Console.log('Hello World'));

const cherry = Command.make('cherry-pick', {}, () => {
  return Effect.gen(function* () {
    cherryCommand({ number: '30' });
    yield* Console.log(`Running 'giti cherry'`);
  });
});

const rebase = Command.make('rebase', {}, () => {
  return Effect.gen(function* () {
    rebaseCommand({ number: '30' });
    yield* Console.log(`Running 'giti rebase'`);
  });
});

const command = giti.pipe(Command.withSubcommands([cherry, rebase]));

const cli = Command.run(command, {
  name: 'giti',
  version: 'v1.0.0',
});

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
