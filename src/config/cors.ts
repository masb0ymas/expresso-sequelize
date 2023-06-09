import type cors from 'cors'
import allowedOrigins from '~/core/constants/allowedOrigins'

/**
 * Initialize Cors
 */
export const corsOptions: cors.CorsOptions = {
  // Restrict Allowed Origin
  origin: allowedOrigins,
}
