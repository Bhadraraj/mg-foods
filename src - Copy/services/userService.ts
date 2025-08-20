// This file is deprecated. Use the new API services from src/services/api/
// Re-export for backward compatibility
export * from './api/user';
export * from './api/labour';

// Import the new user service
import { userService } from './api/user';
export { userService };