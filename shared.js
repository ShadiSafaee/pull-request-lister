import { Octokit } from "octokit";

const octokit = new Octokit();

export function buildPrByRepoAndAuthor(repos, prs) {
	let prByRepoAndAuthor = {};
	repos.forEach((repo) => (prByRepoAndAuthor[repo] = {}));
	prs.forEach((pr) => (prByRepoAndAuthor[getRepo(pr)][pr.user.login] = pr));
	return prByRepoAndAuthor;
}

export async function getPullRequests(repos, authors) {
	const allPrs = [];
	const reposForSearch = repos.map((repo) => `repo:${repo}`).join(" ");
	const authorsForSearch = authors.map((author) => `author:${author.githubUser}`).join(" ");

	let response;
	let page = 1;
	do {
		response = await octokit.rest.search.issuesAndPullRequests({
			q: `is:open ${reposForSearch} ${authorsForSearch}`,
			per_page: 100,
			page,
		});
		allPrs.push(...response.data.items);
		page++;
		wait(100);
	} while (allPrs.length < response.data.total_count && page <= 5);

	return allPrs;
}

export function getUrl(pr) {
	return pr ? pr.html_url : "<missing>";
}

export function doesLabelExist(pr, label) {
	return pr ? pr.labels.some((l) => l.name === label) : false;
}

function getRepo(pr) {
	let components = pr.repository_url.split("/");
	return `${components[components.length - 2]}/${components[components.length - 1]}`;
}

async function wait(millis) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), millis);
	});
}
