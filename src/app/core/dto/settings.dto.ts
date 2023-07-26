import { IsNotEmpty } from "class-validator";
import { CurrencyEnum } from "../../user/enum/currency.enum";
import { LanguageEnum } from "../../user/enum/language.enum";
import { ThemeEnum } from "../../user/enum/theme.enum";


export class SettingsDto {
  @IsNotEmpty()
  currency: CurrencyEnum;

  @IsNotEmpty()
  description: LanguageEnum;

  @IsNotEmpty()
  theme: ThemeEnum

  alerts: boolean;

  informBeforeExpirationDateAmount: number

  informBeforeExpirationDateUnit: string
}