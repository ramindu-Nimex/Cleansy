import mongoose from "mongoose";
import { getLogger } from "../utils/logHandler/contextLogger.js";

const dbConnection = async () => {
  const log = getLogger({ component: 'db' });
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    log.info('DB connected successfully');
  } catch (error) {
    log.error({ err: error }, 'DB connection error');
  }
}

export default dbConnection;
