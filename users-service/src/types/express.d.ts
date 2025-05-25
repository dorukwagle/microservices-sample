import Sessions from "@common/entities/sessions";

declare module 'express' {
    interface Request {
        session?: Sessions
    }
}