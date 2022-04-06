import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class IsApprovedDto {
  @IsString()
  @IsIn(["approved", "rejected"])
  @IsNotEmpty()
  isApproved!: string;
}
