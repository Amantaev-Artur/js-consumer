import amqp from "amqplib";
import cassandra from 'cassandra-driver';

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1:9042'],
  keyspace: 'my_keyspace',
  localDataCenter: 'datacenter1',
  socketOptions: {
    readTimeout: 90000
  }
});

client.connect()
  .then(() => {
    const queue = "users_from_habr";

    (async () => {
      try {
        const connection = await amqp.connect("amqp://guest:guest@localhost:5672/");
        const channel = await connection.createChannel();

        process.once("SIGINT", async () => {
          await channel.close();
          await connection.close();
        });

        await channel.assertQueue(queue, { durable: true });
        await channel.consume(
          queue,
          async (message) => {
            if (message) {
              const data = message.content.toString()
              const user = JSON.parse(data)
              const query = `INSERT INTO my_keyspace.users(id, url, name, html) VALUES (uuid(), ?, ?, ?);`;
              await client.execute(query, [ user.url, user.name, user.html ], { prepare: true });
            }
          },
          { noAck: true }
        );

        console.log(" [*] Waiting for messages. To exit press CTRL+C");
      } catch (err) {
        console.warn(err);
      }
    })();
  })
  .catch(err => console.error('Error connecting to Cassandra:', err));

client.shutdown();
