import { Injectable } from "@nestjs/common";
import { MultiFactorToggleSchema } from "../schema/multi-factor-toggle.schema";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";


@Injectable()
export class MultiFactorToggleValidationPipe extends ZodValidationPipe {
  constructor() {
    super(MultiFactorToggleSchema);
  }
}
