import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interviewai';

  try {
    // Attempt Mongoose connection with 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`\x1b[32m[Database] Connected successfully to MongoDB at ${uri}\x1b[0m`);
  } catch (error) {
    isMongoConnected = false;
    console.log(`\x1b[33m[Database] MongoDB not reachable (${error.message}).\x1b[0m`);
    console.log(`\x1b[36m[Database] Activated Persistent Local Storage Mode (server/data/db.json). Zero setup required!\x1b[0m`);
  }

  // Ensure server/data directory exists for persistent local backup
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  return isMongoConnected;
};

export const getDBStatus = () => {
  return {
    isMongoConnected,
    mode: isMongoConnected ? 'MongoDB (Mongoose)' : 'Persistent Embedded JSON DB',
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interviewai'
  };
};
