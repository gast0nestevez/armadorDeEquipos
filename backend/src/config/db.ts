import mongoose from 'mongoose';

import { getEnv } from '#utils/env.ts';

const connectDB: () => Promise<void> = async (): Promise<void> => {
  await mongoose.connect(getEnv('MONGO_URI'));
  console.log('MongoDB connected successfully');
};

export { connectDB };
