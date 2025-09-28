import { Effect, Data } from 'effect';
import simpleGit from 'simple-git';

export type GitCommit = {
  hash: string;
  date: string;
  message: string;
  author_name: string;
  author_email: string;
};

const git = simpleGit();

export class GitError extends Data.TaggedError('GitError')<{
  message: string;
}> {}

export const getCommits = (): Effect.Effect<GitCommit[], GitError> =>
  Effect.tryPromise({
    try: async () => {
      const log = await git.log(['--all']);

      return log.all.map(commit => ({
        hash: commit.hash,
        date: commit.date,
        message: commit.message,
        author_name: commit.author_name,
        author_email: commit.author_email,
      }));
    },
    catch: error =>
      new GitError({ message: `Failed to get commits: ${error}` }),
  });

export const cherryPick = (commitHash: string): Effect.Effect<void, GitError> =>
  Effect.tryPromise({
    try: async () => {
      await git.raw(['cherry-pick', commitHash]);
    },
    catch: error =>
      new GitError({
        message: `Failed to cherry-pick commit ${commitHash}: ${error}`,
      }),
  });
