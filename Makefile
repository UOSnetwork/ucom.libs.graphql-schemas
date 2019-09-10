publish:
	git checkout master
	make check-project
	npm version ${VER}
	git push
	npm publish

check-project:
	/bin/bash ./check-project.sh

print-current-version pcv:
	npm list | grep 'graphql'
