#!/usr/bin/env bash

npm run build

GIT_STATUS=`git status --porcelain`
printf "\n\n> git status --porcelain\n"
printf "$GIT_STATUS"

CHANGED_FILES=`echo \"$GIT_STATUS\" | wc -l`

if [ "$CHANGED_FILES" -gt 0 ]; then
   printf "\n\nCommitted bundles don't include all changes\n"
else
   printf "\n\nCommitted bundles are up-to-date\n"
fi

exit "$CHANGED_FILES"
