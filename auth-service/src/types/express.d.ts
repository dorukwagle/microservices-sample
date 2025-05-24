import { Sessions } from "generated/prisma";

declare module 'express' {
    interface Request {
        session?: Pick<Sessions, 'userId' | 'sessionToken' | 'roles'>
    }
}