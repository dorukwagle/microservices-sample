import { createZodDto } from "@anatine/zod-nestjs";
import { MultiFactorToggleSchema } from "../schema/multi-factor-toggle.schema";
import { MultiAuth } from "generated/prisma";
import { ApiProperty } from "@nestjs/swagger";


export class MultiFactorToggleDto extends createZodDto(MultiFactorToggleSchema) {
    @ApiProperty({
        example: 'EMAIL',
        enum: MultiAuth,
        description: 'Multi factor authentication type you would like to use. EMAIL or PHONE. Set it to NONE to disable multi factor auth',
    })
    authType: MultiAuth;
}