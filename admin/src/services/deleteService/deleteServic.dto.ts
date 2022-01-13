import { IsNotEmpty, IsString } from "class-validator";

export class DeleteServiceDto {
    @IsString()
    @IsNotEmpty()
    id!: string;

}