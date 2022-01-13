import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class UpdateVendorDto {
  @IsString()
  @IsOptional()
  firstName!: string;

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

  @IsString()
  @IsOptional()
  adharCardImage!: string;

  @IsString()
  @IsOptional()
  panCardImage!: string;

  @IsString()
  @IsOptional()
  availabaleDate!: string;

  @IsString()
  @IsOptional()
  availableTime!: string;

  @IsString()
  @IsOptional()
  @ValidateNested()
  services!: serviceDTO[];
}


class serviceDTO {
  @IsString()
  @IsNotEmpty()
  serviceID!: string;

  @IsString()
  @IsOptional()
  basePrice!: number;
}