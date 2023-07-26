import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from './pipes/custom-date.pipe';
import { CelsiusPipe } from './pipes/celsius.pipe';
import { VoltPipe } from './pipes/volt.pipe';
import { CustomPercentPipe } from './pipes/custom-percent.pipe';
import { WebSocketService } from './services/web-socket.service';
import { AuthService } from './services/auth.service';
import { DelayedHttpService } from './services/delayed-http.service';
import { DeviceService } from './services/device.service';
import { HttpService } from './services/http.service';
import { UserService } from './services/user.service';
import { FahrenheitPipe } from './pipes/fahrenheit.pipe';
import { KiloVoltPipe } from './pipes/kilo-volt.pipe';
import { CustomStringPipe } from './pipes/custom-string.pipe';

@NgModule({
  declarations: [
    CustomDatePipe,
    CelsiusPipe,
    FahrenheitPipe,
    VoltPipe,
    KiloVoltPipe,
    CustomPercentPipe,
    CustomStringPipe,
  ],
  exports: [CustomDatePipe, CelsiusPipe, VoltPipe, KiloVoltPipe, CustomPercentPipe, FahrenheitPipe, CustomStringPipe],
  imports: [CommonModule],
  providers: [AuthService, DelayedHttpService, DeviceService, HttpService, UserService, WebSocketService],
})
export class CoreModule {}
