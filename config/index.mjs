import dotenv from "dotenv";

dotenv.config();

export const { APP_PORT, DEBUG_MODE, MONGO_DB_URL, JWT_SECRET, BASE_URL, TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, FAST2SMS_AUTHORIZATION_HEADER
} = process.env;