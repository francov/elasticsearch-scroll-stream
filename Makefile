MOCHA_BIN=node_modules/.bin/mocha

all:
	@tests/setup.sh > /dev/null
	@sleep 1
	$(MOCHA_BIN) tests/tests.js
	@tests/teardown.sh > /dev/null
