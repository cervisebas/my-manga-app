import type { Config } from 'drizzle-kit';

const config: Config = {
  schema: './src/database/schemas',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
};

export default config;
