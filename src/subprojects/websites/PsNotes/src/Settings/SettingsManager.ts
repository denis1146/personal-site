import { SettingsModel, ETheme } from "./SettingsModel";

export class SettingsManager {
  private _settingsModel: SettingsModel;
  constructor (settingsModel: SettingsModel) {
    this._settingsModel = settingsModel;
  }

  setTheme(theme: ETheme): void {
    this._settingsModel.setTheme(theme);
  }
  getTheme(): ETheme {
    return this._settingsModel.getTheme();
  }

  setGrid(isGrid: boolean): void {
    this._settingsModel.setGrid(isGrid);
  }
  getGrid(): boolean {
    return this._settingsModel.getGrid();
  }

  setFullscreen(isFullscreen: boolean): void {
    this._settingsModel.setFullscreen(isFullscreen);
  }
  getFullscreen(): boolean {
    return this._settingsModel.getFullscreen();
  }
}
