import simpleGit, { type LogResult } from 'simple-git';

export type GitCommit = {
  hash: string;
  date: string;
  message: string;
  author_name: string;
  author_email: string;
};

const git = simpleGit();

export async function getCommits(limit: number = 30): Promise<GitCommit[]> {
  try {
    const log: LogResult = await git.log(['-n', String(limit)]);

    return log.all.map(commit => ({
      hash: commit.hash,
      date: commit.date,
      message: commit.message,
      author_name: commit.author_name,
      author_email: commit.author_email,
    }));
  } catch (error) {
    throw new Error(`Failed to get commits: ${error}`);
  }
}

export async function cherryPick(commitHash: string): Promise<void> {
  try {
    await git.raw(['cherry-pick', commitHash]);
  } catch (error) {
    throw new Error(`Failed to cherry-pick commit ${commitHash}: ${error}`);
  }
}

export async function createFixupCommit(commitHash: string): Promise<void> {
  try {
    await git.commit(`fixup! ${commitHash}`, undefined, {
      '--fixup': commitHash,
    });
  } catch (error) {
    throw new Error(
      `Failed to create fixup commit for ${commitHash}: ${error}`,
    );
  }
}
