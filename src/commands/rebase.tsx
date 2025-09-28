import { Effect, Console } from 'effect';
import { render } from 'ink';
import { getCommits, type GitCommit, GitError } from '../git.js';
import { CommitList } from '../CommitList.js';
import simpleGit from 'simple-git';

export const rebaseCommand = () =>
  Effect.gen(function* () {
    const commits = yield* getCommits();
    if (commits.length === 0) {
      yield* Console.log('No commits found');
      return;
    }

    const selectedCommit = yield* renderCommitSelection(commits);
    if (selectedCommit) {
      yield* performInteractiveRebase(selectedCommit);
    } else {
      yield* Console.log('No commit selected');
    }
  }).pipe(
    Effect.catchAll((error: GitError) =>
      Effect.gen(function* () {
        yield* Console.error(`❌ Error: ${error.message}`);
        yield* Effect.fail(error);
      }),
    ),
  );

const renderCommitSelection = (
  commits: readonly GitCommit[],
): Effect.Effect<GitCommit | null, never> =>
  Effect.async<GitCommit | null, never>(resume => {
    let selectedCommit: GitCommit | null = null;

    const handleSelect = (commit: GitCommit) => {
      selectedCommit = commit;
    };

    const { waitUntilExit } = render(
      <CommitList
        commits={[...commits]}
        onSelect={handleSelect}
        multiSelect={false}
      />,
    );

    waitUntilExit().then(() => {
      resume(Effect.succeed(selectedCommit));
    });
  });

const git = simpleGit();
const performInteractiveRebase = (commit: GitCommit) =>
  Effect.gen(function* () {
    yield* Console.log(
      `🔄 Starting interactive rebase from ${commit.hash.substring(0, 7)}...`,
    );

    yield* Effect.tryPromise({
      try: async () => {
        await git.raw(['rebase', '-i', `${commit.hash}^`]);
      },
      catch: error =>
        new GitError({ message: `Failed to start rebase: ${error}` }),
    });

    yield* Console.log(
      `✅ Interactive rebase started from ${commit.hash.substring(0, 7)}`,
    );
  });
