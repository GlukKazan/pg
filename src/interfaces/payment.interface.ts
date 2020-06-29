import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Payment {

    @ApiProperty()
    msisdn: string;
    
    @ApiProperty()
    date: Date;

    @ApiProperty()
    sum: number;

    @ApiProperty()
    operation: string;

    @ApiProperty()
    code: number;

    @ApiPropertyOptional()
    balance: number;
}