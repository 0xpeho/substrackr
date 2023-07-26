import {IsOptional, IsString} from "class-validator";

export class AuthCredentialsDto{

  @IsString()
  email:string;

  @IsString()
  password:string;

  @IsOptional()
  deviceId?:string;
}
