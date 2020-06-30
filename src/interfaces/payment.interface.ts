import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Payment {

    @ApiProperty()
    msisdn: string;
    
    @ApiPropertyOptional()
    date: Date;

    @ApiProperty()
    sum: number;

    @ApiProperty()
    operation: string;

    @ApiProperty()
    code: number;

    @ApiPropertyOptional()
    message: string;
    
    @ApiPropertyOptional()
    balance: number;
}