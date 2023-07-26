import { IsNotEmpty } from "class-validator";

export class CategoryDto {

  id:string;

  @IsNotEmpty()
  title: string;

}
