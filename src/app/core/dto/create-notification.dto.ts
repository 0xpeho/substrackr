import {Optional} from "@angular/core";

export class NotificationDto {
  @Optional()
  notification_token?: string;
  deviceId:string
}
