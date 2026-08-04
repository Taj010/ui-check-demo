/**
 * Fetches the list of changed files in a GitHub pull request.
 * Requires GITHUB_TOKEN in the environment.
 */
export interface ChangedFile {
  filename: string;
  status: 'added' | 'modified' | 'removed' | 'renamed' | string;
}

export async function getChangedFiles(
  owner: string,
  repo: string,
  prNumber: number,
): Promise<ChangedFile[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  const allFiles: ChangedFile[] = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=100&page=${page}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GitHub API error ${response.status}: ${body}`);
    }

    const files = (await response.json()) as ChangedFile[];
    allFiles.push(...files);

    if (files.length < 100) break;
    page++;
  }

  console.log(`[diff-analyzer] ${allFiles.length} changed file(s) in PR #${prNumber}`);
  allFiles.forEach((f) => console.log(`  ${f.status.padEnd(10)} ${f.filename}`));

  return allFiles;
}
