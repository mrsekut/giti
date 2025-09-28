import React from 'react';
import { render } from 'ink';
import { getCommits, cherryPick } from '../lib/git.js';
import { CommitList } from '../components/CommitList.js';
import type { GitCommit } from '../lib/git.js';

type Options = {
  number: string;
};

export async function cherryCommand(options: Options) {
  const limit = parseInt(options.number, 10);

  try {
    const commits = await getCommits(limit);

    if (commits.length === 0) {
      console.log('No commits found');
      return;
    }

    const handleSelect = async (commit: GitCommit) => {
      try {
        await cherryPick(commit.hash);
        console.log(
          `✅ Cherry-picked: ${commit.hash.substring(0, 7)} - ${commit.message}`,
        );
      } catch (error) {
        console.error(`❌ Failed to cherry-pick: ${error}`);
        process.exit(1);
      }
    };

    const { waitUntilExit } = render(
      <CommitList
        commits={commits}
        onSelect={handleSelect}
        multiSelect={true}
      />,
    );
    await waitUntilExit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
}
