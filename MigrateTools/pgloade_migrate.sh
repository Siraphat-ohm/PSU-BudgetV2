#docker compose exec shadow pgloader \
#mysql://user:password@mysql:3306/database \
#postgresql://postgres:root@localhost:5432/postgres

# Execute commands inside the MySQL container
docker exec -it shadow sh -c "cd pgloader; ./build/bin/pgloader mysql://user:password@mysql/budget68 postgresql://postgres:root@localhost:5432/postgres"