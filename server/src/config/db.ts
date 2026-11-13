import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nova_astronaut';
  
  try {
    // First, attempt connecting to the configured URI (e.g. local mongod or Atlas)
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[NOVA 2.O Database] Connected to MongoDB at ${uri}`);
  } catch (err: any) {
    console.warn(`[NOVA 2.O Database] Local MongoDB not available (${err.message}). Initializing embedded in-memory database...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'nova_astronaut',
        },
      });
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[NOVA 2.O Database] Embedded MongoDB started successfully at ${memoryUri}`);
    } catch (fallbackErr: any) {
      console.error('[NOVA 2.O Database] Failed to initialize fallback database:', fallbackErr);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
