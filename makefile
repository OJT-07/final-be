build: 
	docker compose up -d --build 

up: 
	docker compose up -d

up-clean:
	docker compose up -d --build --force-recreate --remove-orphans

stop: 
	docker compose stop

clear: 
	docker volume rm $(docker volume ls -q)

down: 
	docker compose down

exec:
	docker compose exec app sh

seed:	
	docker compose exec app yarn seed

build-dist: 
	docker compose exec app yarn build exit

format:
 