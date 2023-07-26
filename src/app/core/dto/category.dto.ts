import {IsNotEmpty, IsOptional} from "class-validator";

export class CategoryDto {

  id:string;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  userId?:string

}
