import { Sessions } from "generated/prisma";

declare module 'express' {
    interface Request {
        session?: Sessions
    }
}