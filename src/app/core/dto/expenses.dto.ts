import { IsOptional } from "class-validator";


export class ExpensesTimeFrameDto {
  @IsOptional()
  month:number;

  @IsOptional()
  year:number;
}
