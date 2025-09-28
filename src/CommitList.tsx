import React, { useState } from 'react';
import { Text, Box, useInput, useApp } from 'ink';
import type { GitCommit } from './git.js';

type Props = {
  commits: GitCommit[];
  onSelect: (commit: GitCommit) => void;
  multiSelect?: boolean;
};

export const CommitList: React.FC<Props> = ({
  commits,
  onSelect,
  multiSelect = false,
}) => {
  const { exit } = useApp();
  const [selectedCommits, setSelectedCommits] = useState<Set<string>>(
    new Set(),
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useInput((input, key) => {
    if (input === 'q') {
      exit();
    }

    if (multiSelect && input === ' ') {
      const currentCommit = commits[currentIndex];
      if (currentCommit) {
        const newSelected = new Set(selectedCommits);
        if (newSelected.has(currentCommit.hash)) {
          newSelected.delete(currentCommit.hash);
        } else {
          newSelected.add(currentCommit.hash);
        }
        setSelectedCommits(newSelected);
      }
    }

    if (key.upArrow) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }

    if (key.downArrow) {
      setCurrentIndex(Math.min(commits.length - 1, currentIndex + 1));
    }

    if (key.return) {
      if (multiSelect) {
        const selected = commits.filter(c => selectedCommits.has(c.hash));
        selected.forEach(onSelect);
      } else {
        const currentCommit = commits[currentIndex];
        if (currentCommit) {
          onSelect(currentCommit);
        }
      }
      exit();
    }
  });

  return (
    <Box flexDirection="column">
      <Box
        borderStyle="single"
        borderColor="cyan"
        flexDirection="column"
        paddingX={1}
      >
        <Text color="cyan" bold>
          Select commit{multiSelect ? 's' : ''} to proceed:
        </Text>
      </Box>

      <Box flexDirection="column" marginTop={1}>
        {commits.map((commit, index) => {
          const isSelected = index === currentIndex;
          const isChecked = selectedCommits.has(commit.hash);

          return (
            <Box key={commit.hash}>
              <Text color={isSelected ? 'cyan' : 'white'}>
                {isSelected ? '▶' : ' '}{' '}
                {multiSelect && (isChecked ? '☑' : '☐')}
              </Text>
              <Text color={isSelected ? 'cyan' : 'gray'}>
                {' '}
                {commit.hash.substring(0, 7)} - {commit.message}
              </Text>
            </Box>
          );
        })}
      </Box>

      <Box marginTop={1} borderStyle="single" borderColor="gray">
        <Text dimColor>
          {multiSelect ? '[Space] Toggle  ' : ''}[↑/↓] Navigate [Enter] Confirm
          [q] Quit
        </Text>
      </Box>
    </Box>
  );
};
