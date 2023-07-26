import {IsNotEmpty} from 'class-validator'
import {CategoryDto} from "./category.dto";

export class SubscriptionDto {

    id: string;

    @IsNotEmpty()
    title: string;

    description: string;

    paymentType: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    expirationDate : Date;

    @IsNotEmpty()
    startDate : Date;

    @IsNotEmpty()
    cycle: number;

    category:CategoryDto;
    @IsNotEmpty()
    alerts:boolean;
    @IsNotEmpty()
    hasBeenNotified:boolean;
}
