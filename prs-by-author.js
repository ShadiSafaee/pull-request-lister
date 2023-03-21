import { buildPrByRepoAndAuthor, getPullRequests, doesLabelExist, getUrl } from "./shared.js";
import repos from "./repos.json" assert { type: "json" };
import authors from "./authors.json" assert { type: "json" };

async function run() {
	const prs = await getPullRequests(repos, authors);
	const prByRepoAndAuthor = buildPrByRepoAndAuthor(repos, prs);
	outputPrsByAuthor(prByRepoAndAuthor);
}

function outputPrsByAuthor(prByRepoAndAuthor) {
	authors
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
