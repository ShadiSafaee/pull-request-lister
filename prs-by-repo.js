import { buildPrByRepoAndAuthor, getPullRequests, getReviewedStatus, getUrl } from "./shared.js";
import repos from './repos.json' assert { type: "json" };
import authors from './authors.json' assert { type: "json" };

async function run() {
  const prs = await getPullRequests(repos, authors);
  const prByRepoAndAuthor = buildPrByRepoAndAuthor(repos, prs);
  outputPrsByRepo(prByRepoAndAuthor);
}

function outputPrsByRepo(prByRepoAndAuthor) {
  repos.forEach(repo => {
    let output = authors.map(author => ({
      name: author.name,
      reviewed: getReviewedStatus(prByRepoAndAuthor[repo][author.githubUser]),
      url: getUrl(prByRepoAndAuthor[repo][author.githubUser])
    }))
    .sort((a, b) => a.name < b.name ? -1 : 1)
    .sort((a, b) => !a.reviewed && b.reviewed ? -1 : 1)
    .sort((a, b) => a.url !== '<missing>' && b.url === '<missing>' ? -1 : 1);
    
    console.log();
    console.log(`Pull Requests for ${repo}`);
    console.table(output);
  })
}

run();
