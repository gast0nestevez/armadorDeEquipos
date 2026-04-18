import mongoose from 'mongoose';

const connectDB: () => Promise<void> = async (): Promise<void> => {
  try {
    const uri: string = process.env.MONGO_URI as string;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

export { connectDB };
