import { render } from 'ink';
import { getCommits } from '../git.js';
import { CommitList } from '../CommitList.js';
import type { GitCommit } from '../git.js';
import simpleGit from 'simple-git';

type Options = {
  number: string;
};

const git = simpleGit();

export async function rebaseCommand(options: Options) {
  const limit = parseInt(options.number, 10);

  try {
    const commits = await getCommits(limit);

    if (commits.length === 0) {
      console.log('No commits found');
      return;
    }

    let selectedCommit: GitCommit | null = null;

    const handleSelect = (commit: GitCommit) => {
      selectedCommit = commit;
    };

    const { waitUntilExit } = render(
      <CommitList
        commits={commits}
        onSelect={handleSelect}
        multiSelect={false}
      />,
    );

    await waitUntilExit();

    if (selectedCommit) {
      console.log(
        `🔄 Starting interactive rebase from ${selectedCommit.hash.substring(0, 7)}...`,
      );

      try {
        // git rebase -i <commit>^ を実行（選択したコミットの親から開始）
        await git.raw(['rebase', '-i', `${selectedCommit.hash}^`]);
        console.log(
          `✅ Interactive rebase started from ${selectedCommit.hash.substring(0, 7)}`,
        );
      } catch (error) {
        console.error(`❌ Failed to start rebase: ${error}`);
        process.exit(1);
      }
    } else {
      console.log('No commit selected');
    }
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
}
