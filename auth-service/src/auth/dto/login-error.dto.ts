import { ApiProperty } from "@nestjs/swagger";

export class LoginErrorDto {
    @ApiProperty({
        example: 'Invalid credentials',
        type: 'string',
        description: 'Error message',
    })
    message: string;
}
