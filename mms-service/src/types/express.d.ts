import { Sessions } from "@prisma/client";

declare module 'express' {
    interface Request {
        session?: Sessions
    }
}