export function findRequestedAuthor(requestedAuthor, authors) {
    let foundAuthor = authors.filter(author => author.githubUser.toLowerCase() === requestedAuthor.toLowerCase());
    if(foundAuthor.length === 0) {
        foundAuthor = authors.filter(author => author.name.toLowerCase().includes(requestedAuthor.toLowerCase()));
    }
    if(foundAuthor.length === 0) {
        console.error(`Unable to find '${requestedAuthor}' in authors.json file`);
        process.exit(1);
    }

    return foundAuthor;
}

export function findRequestedRepo(requestedRepo, repos) {
    let foundRepos = repos.filter(repo => repo.toLowerCase().includes(requestedRepo.toLowerCase()));
    if(foundRepos.length === 0) {
        console.error(`Unable to find '${requestedRepo}' in repos.json file`);
        process.exit(1);
    }

    return foundRepos;
}