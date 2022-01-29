import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class VerifyDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  otp!: string;


}
