import { Effect, Console, pipe } from 'effect';
import { render } from 'ink';
import { getCommits, cherryPick, type GitCommit, GitError } from '../git.js';
import { CommitList } from '../CommitList.js';

export const cherryPickCommand = () =>
  Effect.gen(function* () {
    const commits = yield* getCommits();
    if (commits.length === 0) {
      yield* Console.log('No commits found');
      return;
    }

    const selectedCommits = yield* renderCommitSelection(commits);
    if (selectedCommits.length === 0) {
      yield* Console.log('No commits selected');
      return;
    }

    yield* Effect.forEach(selectedCommits, runCherryPick, {
      concurrency: 1,
      discard: true,
    });
  }).pipe(
    Effect.catchAll((error: GitError) =>
      Effect.gen(function* () {
        yield* Console.error(`❌ Error: ${error.message}`);
        yield* Effect.fail(error);
      }),
    ),
  );

const renderCommitSelection = (commits: readonly GitCommit[]) =>
  Effect.async<readonly GitCommit[], never>(resume => {
    const selectedCommits: GitCommit[] = [];

    const handleSelect = (commit: GitCommit) => {
      selectedCommits.push(commit);
    };

    const { waitUntilExit } = render(
      <CommitList
        commits={[...commits]}
        onSelect={handleSelect}
        multiSelect={true}
      />,
    );

    waitUntilExit().then(() => {
      resume(Effect.succeed(selectedCommits));
    });
  });

const runCherryPick = (commit: GitCommit) =>
  pipe(
    cherryPick(commit.hash),
    Effect.tap(() =>
      Console.log(
        `✅ Cherry-picked: ${commit.hash.substring(0, 7)} - ${commit.message}`,
      ),
    ),
    Effect.catchAll(error =>
      Effect.gen(function* () {
        yield* Console.error(
          `❌ Failed to cherry-pick ${commit.hash.substring(0, 7)}: ${error.message}`,
        );
        yield* Effect.fail(error);
      }),
    ),
  );
