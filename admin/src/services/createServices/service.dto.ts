import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ServiceDto {
  @IsString()
  @IsNotEmpty()
   name!: string;
    
  
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  @MinLength(15)
  description!: string;

  @IsNotEmpty()
  image!: string;
    
}
