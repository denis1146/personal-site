import { Signal } from "typed-signals";
import { ISettings, ETheme } from "./ISettings";

class SettingsModel implements ISettings{
  private _theme: ETheme = ETheme.Light;
  private _isGrid: boolean = false;
  private _isFullscreen: boolean = false;

  constructor() {
  }

  readonly themeChanged = new Signal<(theme: ETheme) => void>();
  setTheme(theme: ETheme): void {
    if (this._theme !== theme) {
      this._theme = theme;
      this.themeChanged.emit(this._theme);
    }
  }
  getTheme(): ETheme {
    return this._theme;
  }

  readonly gridChanged = new Signal<(isGrid: boolean) => void>();
  setGrid(isGrid: boolean): void {
    if (this._isGrid !== isGrid) {
      this._isGrid = isGrid;
      this.gridChanged.emit(this._isGrid);
    }
  }
  getGrid(): boolean {
    return this._isGrid;
  }

  readonly fullscreenChanged = new Signal<(isFullscreen: boolean) => void>();
  setFullscreen(isFullscreen: boolean): void {
    if (this._isFullscreen !== isFullscreen) {
      this._isFullscreen = isFullscreen;
      this.fullscreenChanged.emit(this._isFullscreen);
    }
  }
  getFullscreen(): boolean {
    return this._isFullscreen
  }
}

export { SettingsModel, ETheme };
