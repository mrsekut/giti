import { Command, Options } from '@effect/cli';
import { BunContext, BunRuntime } from '@effect/platform-bun';
import { Console, Effect } from 'effect';
import { cherryCommand } from './commands/cherry.js';
import { rebaseCommand } from './commands/rebase.js';

const numberOption = Options.text('number').pipe(
  Options.withAlias('n'),
  Options.withDefault('30'),
  Options.withDescription('Number of commits to show'),
);

const giti = Command.make('giti', {}, () => Console.log('Git Interactive CLI'));

const cherry = Command.make(
  'cherry-pick',
  { number: numberOption },
  ({ number }) => cherryCommand({ number }),
);

const rebase = Command.make('rebase', { number: numberOption }, ({ number }) =>
  rebaseCommand({ number }),
);

const command = giti.pipe(Command.withSubcommands([cherry, rebase]));

const cli = Command.run(command, {
  name: 'giti',
  version: 'v1.0.0',
});

cli(process.argv).pipe(Effect.provide(BunContext.layer), BunRuntime.runMain);
