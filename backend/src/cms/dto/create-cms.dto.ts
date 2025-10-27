import { IsString, IsOptional, IsObject, IsBoolean, IsNumber } from 'class-validator';

export class CreateCmsDto {
    @IsString()
    section: string;

    @IsObject()
    data: Record<string, any>;

    @IsOptional()
    @IsNumber()
    order?: number;

    @IsOptional()
    @IsBoolean()
    published?: boolean;
}
