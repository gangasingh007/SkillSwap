import dotenv from 'dotenv';
import { connectDB } from './utils/db';
import app from './app';

dotenv.config({ path: '../../.env' });

const PORT = process.env.PORT || 4000;

app.listen(PORT, async() => {
  await connectDB();
  console.log(`API Server running on http://localhost:${PORT}`);
});
