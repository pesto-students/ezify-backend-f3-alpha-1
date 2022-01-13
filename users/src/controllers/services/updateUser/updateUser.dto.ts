import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUsersDto {
  @IsString()
  @IsOptional()
  firstName!: string;

  @IsString()
  @IsOptional()
  address!: string;

  @IsString()
  @IsOptional()
  lastName!: string;

  @IsNumber()
  @IsOptional()
  mobileNumber!: string;

  @IsString()
  @IsOptional()
  profileImage!: string;

  @IsString()
  @IsOptional()
  city!: string;

  @IsString()
  @IsOptional()
  state!: string;

  @IsBoolean()
  @IsOptional()
  isActive!: string;

  @IsBoolean()
  @IsOptional()
  isEmaiVerified!: string;

  @IsIn(["user", "vendor"])
  @IsString()
  @IsOptional()
  roles!: string;
}
