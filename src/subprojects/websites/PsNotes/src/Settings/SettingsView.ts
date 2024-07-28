import { SettingsModel, ETheme } from "./SettingsModel";
import { SettingsManager } from "./SettingsManager"

export class SettingsView {
  private readonly _settingsManager: SettingsManager;
  private readonly _themeSwitcherButton: HTMLButtonElement = document.querySelector('#theme-switcher') as HTMLButtonElement;
  private readonly _gridSwitcherButton: HTMLButtonElement = document.querySelector('#grid-switcher') as HTMLButtonElement;
  private readonly _fullscreenSwitcher: HTMLButtonElement = document.querySelector('#fullscreen-switcher') as HTMLButtonElement;

  constructor(settingsModel: SettingsModel) {
    this._settingsManager = new SettingsManager(settingsModel);
    settingsModel.themeChanged.connect(this.setTheme);
    settingsModel.gridChanged.connect(this.setGrid.bind(this));
    settingsModel.gridChanged.connect((isGrid: boolean) => {
      const mainContainer: HTMLDivElement = document.querySelector('.main__container') as HTMLDivElement;
      mainContainer.classList.toggle('main__container_grid');

      for(const currentItem of Array.from(mainContainer.children)) {
        currentItem.classList.toggle('main__item_grid');
      }
    });

    if (!document.fullscreenEnabled) {
      this._fullscreenSwitcher.style.display = 'none';
      settingsModel.fullscreenChanged.connect(this.setFullscreen.bind(this));
    }

    this.bindListeners();
  }

  private onThemeClick = (event: Event): void => {
    if (event.target == this._themeSwitcherButton) {
      this.setTheme(this._settingsManager.getTheme() === ETheme.Dark ? ETheme.Light : ETheme.Dark);
    }
  }

  setTheme(theme: ETheme): void {
    const currentTheme: ETheme = document.body.classList.contains('darkMode') ? ETheme.Dark : ETheme.Light;
    if (currentTheme !== theme) {
      const enum EButtomTheme {
        Dark = 'dark_mode'
      , Light = 'light_mode'
      }
      const themeSpan: HTMLSpanElement = this._themeSwitcherButton.firstChild as HTMLSpanElement;
      themeSpan.textContent = theme !== ETheme.Dark ? EButtomTheme.Dark : EButtomTheme.Light;

      document.body.classList.toggle('darkMode');
      this._settingsManager.setTheme(theme);
    }
  }

  private onGridClick = (event: Event): void => {
    if (event.target == this._gridSwitcherButton) {
      this.setGrid(!this._settingsManager.getGrid());
    }
  }

  setGrid(isGrid: boolean): void {
    const enum EButtomGrid {
      Grid = 'grid_view'
    , List = 'view_agenda'
    }
    const gridSpan: HTMLSpanElement = this._gridSwitcherButton.firstChild as HTMLSpanElement;
    const isGridCurrent: boolean = gridSpan.textContent !== EButtomGrid.Grid;
    if (isGridCurrent !== isGrid) {
      gridSpan.textContent = isGrid ? EButtomGrid.List : EButtomGrid.Grid;
      this._settingsManager.setGrid(isGrid);
    }
  }

  private onChangeFullscreen = (event: Event): void => {
    if (document.fullscreenEnabled && event.target == this._fullscreenSwitcher) {
      this.setFullscreen(!this._settingsManager.getFullscreen());
    }
  }

  setFullscreen(isFullscreen: boolean): void {
    const enum EButtomFullscreen {
      Fullscreen = 'fullscreen'
    , NotFullscreen = 'fullscreen_exit'
    }

    const fullscreenSpan: HTMLSpanElement = this._fullscreenSwitcher.firstChild as HTMLSpanElement;
    const isFullscreenCurrent: boolean = fullscreenSpan.textContent !== EButtomFullscreen.Fullscreen;
    if (isFullscreenCurrent !== isFullscreen) {
      fullscreenSpan.textContent = isFullscreen ? EButtomFullscreen.NotFullscreen : EButtomFullscreen.Fullscreen;
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      }
      else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      this._settingsManager.setFullscreen(isFullscreen);
    }
  }

  private bindListeners(): void {
    document.body.addEventListener('click', this.onThemeClick);
    document.body.addEventListener('click', this.onGridClick);
    if (document.fullscreenEnabled) {
      document.body.addEventListener('click', this.onChangeFullscreen);
    }
  }
}
