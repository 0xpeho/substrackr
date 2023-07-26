import { IsNotEmpty } from "class-validator";
import {CategoryDto} from "./category.dto";
import {SubscriptionDto} from "./subscription.dto";


export class CategoryTotalDto {

  @IsNotEmpty()
  category:CategoryDto;

  @IsNotEmpty()
  total:number

  subscriptions:SubscriptionDto[]

}
