import { connectDB } from '@/config/prisma';
import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.warn(`Server ready at http://localhost:${PORT}`);
    });
  } catch {
    process.exit(1);
  }
})();
