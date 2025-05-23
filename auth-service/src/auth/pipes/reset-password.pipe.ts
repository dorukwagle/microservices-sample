import { Injectable } from "@nestjs/common";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { ResetPasswordSchema } from "../schema/reset-password.schema";


@Injectable()
export class ResetPasswordPipe extends ZodValidationPipe {
    constructor() {
        super(ResetPasswordSchema);
    }
}
