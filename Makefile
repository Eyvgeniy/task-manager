start:
	docker-compose up

bash:
	docker-compose run --rm --service-ports web /bin/bash
