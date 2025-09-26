export {}

import { AuthUser } from './types/interfaceUser'

declare global {
    namespace Express {
        interface Request {
            user: AuthUser
        }
    }
}
