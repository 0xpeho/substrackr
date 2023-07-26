import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from './services/http.service';
@NgModule({
  declarations: [
  ],
  exports: [],
  imports: [CommonModule],
  providers: [HttpService],
})
export class CoreModule {}
