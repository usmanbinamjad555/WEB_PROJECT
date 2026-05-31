import mongoose from 'mongoose';

export class DatabaseConfig {
  public static async connect(): Promise<void> {
    try {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/multimart_db';

      mongoose.connection.on('connected', () => {
        console.log('MongoDB Mongoose Engine Connected Securely.');
      });

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB Connection Subsystem Error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB Connection Disconnected.');
      });

      await mongoose.connect(mongoUri, {
        autoIndex: true, // Automatically build compound indexes for tenant isolation
      });
    } catch (error) {
      console.error('Failed to initialize MongoDB connection layout:', error);
      throw error;
    }
  }
}