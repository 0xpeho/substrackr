import { IsNotEmpty } from "class-validator";
import {CurrencyEnum} from "../enum/currency.enum";
import {LanguageEnum} from "../enum/language.enum";
import {ThemeEnum} from "../enum/theme.enum";



export class SettingsDto {
  @IsNotEmpty()
  currency: CurrencyEnum;

  @IsNotEmpty()
  language: LanguageEnum;

  @IsNotEmpty()
  theme: ThemeEnum

  alerts: boolean;

  informBeforeExpirationDateAmount: number

  informBeforeExpirationDateUnit: string
}
