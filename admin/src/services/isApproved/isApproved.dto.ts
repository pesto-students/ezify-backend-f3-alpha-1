import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class IsApprovedDto {
  @IsBoolean()
  @IsNotEmpty()
  isApproved!: boolean;
}
