import amqp from 'amqplib';

export async function publishMessage(data: any) {
  const connection = await amqp.connect('amqp://admin:admin123@192.168.1.111:5672');
  const channel = await connection.createChannel();
  
  const exchange = 'file_uploads_exchange';
  const queue = 'file_uploads_queue';
  
  await channel.assertExchange(exchange, 'fanout', { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, '');
  
  channel.publish(exchange, '', Buffer.from(JSON.stringify(data)));

  await channel.close();
  await connection.close();
}

export async function subscribeToMessages(callback: (data: any) => void) {
  const connection = await amqp.connect('amqp://admin:admin123@192.168.1.111:5672');
  const channel = await connection.createChannel();
  
  const exchange = 'file_uploads_exchange';
  const queue = 'file_uploads_queue';
  
  await channel.assertExchange(exchange, 'fanout', { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, exchange, '');
  
  channel.consume(queue, (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      callback(data);
      channel.ack(msg);
    }
  });

  return () => {
    channel.close();
    connection.close();
  };
}