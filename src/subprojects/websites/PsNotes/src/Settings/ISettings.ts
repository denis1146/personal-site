enum ETheme {
  Dark
, Light
}

interface ISettings {
  setTheme(theme: ETheme): void;
  getTheme(): ETheme;

  setGrid(isGrid: boolean): void;
  getGrid(): boolean;

  setFullscreen(isFullscreen: boolean): void;
  getFullscreen(): boolean;
}

export { ISettings, ETheme };
