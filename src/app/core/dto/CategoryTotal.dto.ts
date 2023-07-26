import { IsNotEmpty } from "class-validator";
import { Category } from "../category.entity";
import { SubscriptionDto } from "../../subscription/dto/subscription.dto";

export class CategoryTotalDto {

  @IsNotEmpty()
  category:Category;

  @IsNotEmpty()
  total:number

  subscriptions:SubscriptionDto[]

}