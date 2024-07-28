import { SettingsView } from './Settings/SettingsView';
import { SettingsModel } from "./Settings/SettingsModel";

class Application {
  private _settingsView: SettingsView | null = null;

  start(): void {
    const settingsModel = new SettingsModel();
    this._settingsView = new SettingsView(settingsModel);
  }
}

export default Application;
