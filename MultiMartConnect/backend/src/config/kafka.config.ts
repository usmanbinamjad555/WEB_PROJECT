import { Kafka, KafkaConfig as KafkaJSConfig, logLevel } from 'kafkajs';

const kafkaBrokers = process.env.KAFKA_BROKERS 
  ? process.env.KAFKA_BROKERS.split(',') 
  : ['localhost:9092'];

const config: KafkaJSConfig = {
  clientId: 'multimart-connect-core',
  brokers: kafkaBrokers,
  ssl: process.env.NODE_ENV === 'production',
  logLevel: logLevel.NOTHING // Silences internal network logging streams completely
};

export const kafkaInstance = new Kafka(config);