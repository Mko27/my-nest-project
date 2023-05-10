export const amqpClientOptions = {
  urls: [process.env.RABBIT_MQ_URL],
  queue: process.env.RABBIT_MQ_QUEUE,
  queueOptions: {
    durable: true,
  },
};
