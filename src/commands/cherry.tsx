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

    const selectedCommits: GitCommit[] = [];

    const handleSelect = (commit: GitCommit) => {
      selectedCommits.push(commit);
    };

    const { waitUntilExit } = render(
      <CommitList
        commits={commits}
        onSelect={handleSelect}
        multiSelect={true}
      />,
    );

    await waitUntilExit();

    // 選択されたコミットを順番にcherry-pick
    for (const commit of selectedCommits) {
      try {
        await cherryPick(commit.hash);
        console.log(
          `✅ Cherry-picked: ${commit.hash.substring(0, 7)} - ${commit.message}`,
        );
      } catch (error) {
        console.error(
          `❌ Failed to cherry-pick ${commit.hash.substring(0, 7)}: ${error}`,
        );
        process.exit(1);
      }
    }

    if (selectedCommits.length === 0) {
      console.log('No commits selected');
    }
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
}
