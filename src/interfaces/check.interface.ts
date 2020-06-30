import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Check {

    @ApiProperty()
    msisdn: string;

    @ApiPropertyOptional()
    status: boolean;

    @ApiPropertyOptional()
    account: number;

    @ApiPropertyOptional()
    message: string;
}
