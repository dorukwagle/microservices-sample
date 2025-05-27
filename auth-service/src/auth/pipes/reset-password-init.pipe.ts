import { Injectable } from "@nestjs/common";
import { ResetPasswordInitSchema } from "../schema/reset-password-init.schema";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";


@Injectable()
export class ResetPasswordInitValidationPipe extends ZodValidationPipe {
  constructor() {
    super(ResetPasswordInitSchema);
  }
}
