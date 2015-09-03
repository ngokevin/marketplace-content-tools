install:
	@npm install
	@npm run build

test: install
	@npm test

test-sherlocked: install
	@cd src && python -m SimpleHTTPServer &
	@sleep 5 && node sherlocked.js
