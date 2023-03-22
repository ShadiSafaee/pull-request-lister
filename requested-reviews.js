import { buildPrByRepoAndAuthor, getPullRequests, doesLabelExist, getUrl } from "./shared.js";
import repos from "./repos.json" assert { type: "json" };
import authors from "./authors.json" assert { type: "json" };

async function run() {
	const prs = await getPullRequests(repos, authors);
	const prByRepoAndAuthor = buildPrByRepoAndAuthor(repos, prs);
	outputPrsByRepo(prByRepoAndAuthor);
}

function outputPrsByRepo(prByRepoAndAuthor) {
	let requestedReviews = repos.flatMap(repo => authors
        .map(author => buildOutputObj(prByRepoAndAuthor[repo][author.githubUser], repo, author))
        .filter(pr => !pr.reviewed && pr.reviewRequested)
	).map(pr => ({
        repo: pr.repo,
        name: pr.name,
        url: pr.url,
    }))

    console.log(`Requested Reviews`);
    console.table(requestedReviews);
}

function buildOutputObj(pr, repo, author) {
	return {
        repo,
		name: author.name,
		reviewRequested: doesLabelExist(pr, "review requested"),
		reviewed: doesLabelExist(pr, "reviewed"),
		url: getUrl(pr),
	};
}

function authorToMissingPr(author) {
	return {
		name: author.name,
		reviewRequested: "-",
		reviewed: "-",
		url: "<missing>",
	};
}

run();
