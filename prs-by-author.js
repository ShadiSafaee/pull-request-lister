import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { buildPrByRepoAndAuthor, getPullRequests, doesLabelExist, getUrl } from "./shared.js";
import { findRequestedAuthor, findRequestedRepo } from './filters.js';
import repos from "./repos.json" assert { type: "json" };
import authors from "./authors.json" assert { type: "json" };

async function run() {
	const argv = yargs(hideBin(process.argv)).argv;
	
	let authorsForSearch = authors;
	if(argv.author) {
		authorsForSearch = findRequestedAuthor(argv.author, authors);
	}

	const prs = await getPullRequests(reposForSearch, authorsForSearch);
	const prByRepoAndAuthor = buildPrByRepoAndAuthor(repos, prs);
	outputPrsByAuthor(prByRepoAndAuthor);
}

function outputPrsByAuthor(prByRepoAndAuthor) {
	let authorsWithPrs = [...new Set(Object.values(prByRepoAndAuthor).flatMap(repo => Object.keys(repo)))];

	authors.filter(author => authorsWithPrs.includes(author.githubUser))
		.sort((a, b) => (a.name < b.name ? -1 : 1))
		.forEach((author) => {
			let output = repos.map((repo) => ({
				repo,
				reviewRequested: doesLabelExist(prByRepoAndAuthor[repo][author.githubUser], 'review requested'),
				reviewed: doesLabelExist(prByRepoAndAuthor[repo][author.githubUser], 'reviewed'),
				url: getUrl(prByRepoAndAuthor[repo][author.githubUser]),
			}));

			let raisedPrs = output.filter(pr => pr.url !== '<missing>').length;

			console.log();
			console.log(`Pull Requests for ${author.name} - ${raisedPrs}/${repos.length}`);
			console.table(output);
		});
}

run();
