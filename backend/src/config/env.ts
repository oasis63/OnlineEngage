import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  REDIS_URL: z.string().default('rediss://default:gQAAAAAAAqq0AAIgcDE2YWIyYWU1ZjUwNTE0NWIwYjAxYjRlYTllYjRmNzJmMw@coherent-locust-174772.upstash.io:6379'),
  CORS_ORIGIN: z.string().default('*'),
  LOG_LEVEL: z.string().default('info'),
});

export const env = envSchema.parse(process.env);
