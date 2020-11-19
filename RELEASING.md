This guide explains the steps needed for a release.

1. Run build and test to verify the current state:
```
npm run build
npm run test
```
- Verify that there are no changes in the `dist` directory (i.e. that the latest version is committed)
- Verify all tests are passing

2. Update the changelog and commit

3. Update the package version (updates version in package.json, makes a commit and creates a tag):
```
npm version <version number>
```

4. Push new version, including tags, to master:
```
git push
git push --tags
```

5. Publish new version to npm:
```
npm publish
```

6. Merge master into the `gh-pages` branch to update the live demo
```
git checkout gh-pages
git pull
git merge origin/master
git push
```
