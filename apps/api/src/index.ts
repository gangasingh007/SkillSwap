import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });    // apps/api/.env

import { connectDB } from './utils/db';
import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, async() => {
  await connectDB();
  console.log(`API Server running on http://localhost:${PORT}`);
});
