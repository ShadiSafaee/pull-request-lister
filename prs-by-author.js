import { buildPrByRepoAndAuthor, getPullRequests, getReviewedStatus, getUrl } from "./shared.js";
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
				reviewed: getReviewedStatus(prByRepoAndAuthor[repo][author.githubUser]),
				url: getUrl(prByRepoAndAuthor[repo][author.githubUser]),
			}));

			console.log();
			console.log(`Pull Requests for ${author.name}`);
			console.table(output);
		});
}

run();
