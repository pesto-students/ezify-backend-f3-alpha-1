import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UsersDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsIn(["user", "vendor"])
  @IsString()
  @IsOptional()
  role!: string;
}
