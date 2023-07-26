import { Component } from '@angular/core';
import {SETTINGS} from "../../core/constants/router.constants";

@Component({
  selector: 'app-tab3',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class Settings {
  SETTINGS: string = SETTINGS;

  constructor() {}

}
