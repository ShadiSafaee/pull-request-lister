# Pull Request Listing Tool
Allows you to quickly view open pull requests for the specified repositories and authors, along with whether the pull request has been reviewed (based on the presence of a `reviewed` label).
- View pull requests by repository
- View pull requests by author

## How to run
- Clone the repository
- Run `npm install` from the root of the repository
- Create a `repos.json` at the root of the project (will be git-ignored), and add the repositories for which you'd like to view pull requests (see the `example-repos.json` for an example of the file structure)
- Create a `authors.json` file at the root of the project (will be git-ignored), and add the authors for which you'd like to view pull requests (see the `example-authors.json` for an example of the file structure)
- Run either `node prs-by-repo.js` or `node prs-by-author.js`
