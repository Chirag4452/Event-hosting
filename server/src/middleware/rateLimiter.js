import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for registration endpoint
 * Limits: 5 requests per 15 minutes
 */
export const registrationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again later.',
    error: 'RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many registration attempts. Please try again later.',
      error: 'RATE_LIMIT_EXCEEDED',
      retryAfter: '15 minutes'
    });
  }
});

/**
 * General rate limiter for all endpoints
 * Limits: 100 requests per 15 minutes
 */
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    error: 'RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      error: 'RATE_LIMIT_EXCEEDED',
      retryAfter: '15 minutes'
    });
  }
});

/**
 * Strict rate limiter for sensitive endpoints
 * Limits: 3 requests per 15 minutes
 */
export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    success: false,
    message: 'Too many attempts. Please try again later.',
    error: 'RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many attempts. Please try again later.',
      error: 'RATE_LIMIT_EXCEEDED',
      retryAfter: '15 minutes'
    });
  }
});
