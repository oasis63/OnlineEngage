import { Redis } from 'ioredis';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export let redisClient: Redis;

export function initRedis(): Redis {
  if (!redisClient) {
    const isSecure = env.REDIS_URL.startsWith('rediss://');

    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 5,
      tls: isSecure ? { rejectUnauthorized: false } : undefined,
      retryStrategy(times) {
        const delay = Math.min(times * 150, 3000);
        logger.warn(`Redis reconnecting, attempt ${times}...`);
        return delay;
      },
      lazyConnect: false,
    });

    redisClient.on('connect', () => logger.info('Redis (Upstash) connected successfully'));
    redisClient.on('ready', () => logger.info('Redis ready for matchmaking commands'));
    redisClient.on('error', (err) => logger.error({ err }, 'Redis connection error'));
  }
  return redisClient;
}

redisClient = initRedis();
