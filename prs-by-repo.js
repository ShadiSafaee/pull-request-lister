import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { buildPrByRepoAndAuthor, getPullRequests, doesLabelExist, getUrl } from "./shared.js";
import { findRequestedRepo } from "./filters.js";
import repos from './repos.json' assert { type: "json" };
import authors from './authors.json' assert { type: "json" };

async function run() {
  const argv = yargs(hideBin(process.argv)).argv;

	let reposForSearch = repos;
	if(argv.repo) {
		reposForSearch = findRequestedRepo(argv.repo, repos);
	}

  const prs = await getPullRequests(reposForSearch, authors);
  const prByRepoAndAuthor = buildPrByRepoAndAuthor(reposForSearch, prs);
  outputPrsByRepo(prByRepoAndAuthor);
}

function outputPrsByRepo(prByRepoAndAuthor) {
  Object.keys(prByRepoAndAuthor).forEach(repo => {
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
