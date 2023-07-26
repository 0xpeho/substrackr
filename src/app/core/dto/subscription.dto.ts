import {IsNotEmpty} from 'class-validator'

export class SubscriptionDto {
    @IsNotEmpty()
    title: string;

    description: string;

    paymentType: string;

    @IsNotEmpty()
    price: number;

    /*
    @IsNotEmpty()
    expirationDate : Date;

     */

    @IsNotEmpty()
    cycle: number;

    category:string;

    @IsNotEmpty()
    alerts:boolean;
}