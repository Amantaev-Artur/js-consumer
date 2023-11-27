# js-consumer

Для поднятия проекта запускаем

```
docker compose up --build
```

Далее в отдельном терминале выполняем команду для открытия консоли кассандры

```
docker exec -it js-consumer-cassandra-1 cqlsh
```

В ней выполняем
```
CREATE KEYSPACE my_keyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};

CREATE TABLE my_keyspace.users (id UUID PRIMARY KEY, url text, name text, html text);
```

Выходим из этой консоли и поднимаем consumer при помощи

```
npm ci
npm run start
```
