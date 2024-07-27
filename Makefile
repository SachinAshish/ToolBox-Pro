restart:
	make stop
	make start

start:
	-docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
	-docker exec -d website npx prisma studio
	-./mongo/rs-init.sh

stop:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v