const fs = require('fs');
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.ACCESS_TOKEN });

async function getStats() {
  const username = 'InkyzProd;
  const { data: repos } = await octokit.repos.listForUser({ username });
  const totalProjects = repos.length;
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

  return { totalProjects, totalStars };
}

async function updateReadme() {
  const { totalProjects, totalStars } = await getStats();
  const statsContent = `
I have **${totalProjects}** projects on GitHub with a total of **${totalStars}** stars.
  `;

  const readmePath = 'README.md';
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');

  const updatedReadme = readmeContent.replace(
    /<!--START_SECTION:stats-->[\s\S]*<!--END_SECTION:stats-->/,
    `<!--START_SECTION:stats-->\n${statsContent}\n<!--END_SECTION:stats-->`
  );

  fs.writeFileSync(readmePath, updatedReadme);
}

updateReadme();
