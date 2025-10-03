// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "CAiN",
    slug: "cain",
    version: "1.0.0",
    extra: {
      FAL_API_KEY: process.env.FAL_API_KEY,
      FAL_ENDPOINT: process.env.FAL_ENDPOINT,
      MOCK_MODE: process.env.MOCK_MODE === 'true',
    },
  },
};
