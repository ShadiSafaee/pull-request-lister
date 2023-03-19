# Pull Request Listing Tool
Allows you to quickly view open pull requests for the specified repositories and authors, along with whether the pull request has been reviewed (based on the presence of a `reviewed` label).
- View pull requests by repository
- View pull requests by author

## How to run
- Clone the repository
- Run `npm install` from the root of the repository
- Add the repositories you'd like to view pull requests for in the `repos.json` file
- Add the authors you'd like to view pull requests for in the `authors.json` file
- Run either `node prs-by-repo.js` or `node prs-by-author.js`
