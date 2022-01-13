import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateServiceDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @MaxLength(250)
  @MinLength(15)
  @IsOptional()
  description!: string;

  @IsString()
  @IsOptional()
  image!: string;
}
