import { kafkaInstance } from '../config/kafka.config';
import { Consumer } from 'kafkajs';

export class KafkaConsumerService {
  private consumer: Consumer;

  constructor(groupId: string) {
    this.consumer = kafkaInstance.consumer({ groupId });
  }

  public async subscribe(
    topics: string[], 
    messageProcessor: (topic: string, key: string | null, payload: any) => Promise<void>
  ): Promise<void> {
    try {
      await this.consumer.connect();
      console.log(`Kafka Consumer connecting for Group ID: ${this.consumer.type}`);
      
      for (const topic of topics) {
        await this.consumer.subscribe({ topic, fromBeginning: false });
      }

      await this.consumer.run({
        eachMessage: async ({ topic, message }) => {
          const key = message.key ? message.key.toString() : null;
          const valueStr = message.value ? message.value.toString() : '{}';
          try {
            const parsed = JSON.parse(valueStr);
            await messageProcessor(topic, key, parsed.payload);
          } catch (err) {
            console.error(`Error executing event stream processor on topic ${topic}:`, err);
          }
        },
      });
    } catch (error) {
      console.error('Kafka Consumer subscription initialization failed:', error);
      throw error;
    }
  }
}