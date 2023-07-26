import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ThemeEnum} from "../enum/theme.enum";

@Injectable({
  providedIn: 'root',
})
export class ColorSchemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  async getColorScheme(): Promise<ThemeEnum> {
    const colorScheme = <ThemeEnum>localStorage.getItem('colorScheme') ?? ThemeEnum.AUTO;
    await this.setColorScheme(colorScheme);
    return colorScheme;
  }

  async setColorScheme(newColorScheme: string): Promise<void> {
    localStorage.setItem('colorScheme', newColorScheme);
    await this.loadStoredTheme();
  }

  async loadStoredTheme(): Promise<void> {
    let colorScheme = localStorage.getItem('colorScheme');
    if (!colorScheme) {
        colorScheme=ThemeEnum.AUTO;
        await this.setColorScheme(colorScheme)
    }
    this.document.body.classList.remove(ThemeEnum.AUTO);
    this.document.body.classList.remove(ThemeEnum.DARK);
    this.document.body.classList.remove(ThemeEnum.LIGHT);
    this.document.body.classList.add(colorScheme===ThemeEnum.AUTO?(window.matchMedia('(prefers-color-scheme: dark)').matches?ThemeEnum.DARK:ThemeEnum.LIGHT):colorScheme);
  }
}
