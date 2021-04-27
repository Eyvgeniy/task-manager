start:
	docker-compose up

bash:
	docker-compose run --rm --service-ports web /bin/bash

lint:
	bundle exec rubocop -a
