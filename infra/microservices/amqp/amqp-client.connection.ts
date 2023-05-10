export type PublishInQueueArgs = {
  message: string;
  headers: {
    subject: string;
  };
};

export class AmqpClient {
  public async publishInQueue(
    channel,
    messageArgs: PublishInQueueArgs,
  ): Promise<boolean> {
    console.log(channel.send);
    try {
      const publish = await channel.send('subject', messageArgs.message);

      return publish;
    } catch (error) {
      console.error('Failed to publish message to queue', error);
      throw error;
    }
  }

  public async readInQueue(this): Promise<void> {
    await this.channel.assertQueue(this.queue, { durable: false });
    this.channel.consume(
      this.queue,
      (message) => {
        console.log(message.content.toString());
      },
      { noAck: true },
    );
  }
}
