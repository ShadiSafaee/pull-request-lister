import { buildPrByRepoAndAuthor, getPullRequests, doesLabelExist, getUrl } from "./shared.js";
import repos from './repos.json' assert { type: "json" };
import authors from './authors.json' assert { type: "json" };

async function run() {
  const prs = await getPullRequests(repos, authors);
  const prByRepoAndAuthor = buildPrByRepoAndAuthor(repos, prs);
  outputPrsByRepo(prByRepoAndAuthor);
}

function outputPrsByRepo(prByRepoAndAuthor) {
  repos.forEach(repo => {
    let missingAuthors = authors.filter(author => !prByRepoAndAuthor[repo][author.githubUser]);
    let allPrs = authors
      .filter(author => !missingAuthors.includes(author))
      .map(author => authorToOutputObj(prByRepoAndAuthor[repo][author.githubUser], author));

    let missing = missingAuthors.map(authorToMissingPr);
    let reviewed = allPrs.filter(pr => pr.reviewed);
    let notReviewedButNotRequested = allPrs.filter(pr => !pr.reviewed && !pr.reviewRequested);
    let notReviewedAndRequested = allPrs.filter(pr => !pr.reviewed && pr.reviewRequested);

    console.log();
    console.log(`Pull Requests for ${repo}`);
    console.table([...notReviewedAndRequested, ...notReviewedButNotRequested, ...reviewed, ...missing]);
  })
}

function authorToOutputObj(pr, author) {
  return {
    name: author.name,
    reviewRequested: doesLabelExist(pr, 'review requested'),
    reviewed: doesLabelExist(pr, 'reviewed'),
    url: getUrl(pr)
  }
}

function authorToMissingPr(author) {
  return {
    name: author.name,
    reviewRequested: '-',
    reviewed: '-',
    url: '<missing>'
  };
}

run();
