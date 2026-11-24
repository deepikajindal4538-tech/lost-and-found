import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB Connected to Atlas/Local: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`⚠️ Failed to connect to MONGODB_URI: ${err.message}`);
      console.log('🔄 Attempting fallback to in-memory MongoDB server for local execution...');
    }
  }

  // Graceful fallback to MongoMemoryServer so application runs seamlessly out-of-the-box
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const memoryUri = mongod.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ MongoDB Memory Server connected successfully: ${memoryUri}`);
    return conn;
  } catch (memErr) {
    console.error('❌ Could not start MongoDB Memory Server:', memErr.message);
    throw memErr;
  }
};
