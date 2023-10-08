class EventListenerManager {
  constructor() {
    document.body.addEventListener('click', this.changeTheme());
    document.body.addEventListener('click', this.changeGrid());
    document.body.addEventListener('click', this.changeFullscreen());
  }

  private changeTheme(): EventListenerOrEventListenerObject {
    let isDarkMode: boolean = false;
    const themeSwitcher: HTMLButtonElement = document.querySelector('#theme-switcher') as HTMLButtonElement;
    return function (event: Event): void {
      if (event.target == themeSwitcher) {
        isDarkMode = !isDarkMode;
        ((event.target as HTMLButtonElement).firstChild as HTMLSpanElement).textContent = isDarkMode ? 'light_mode' : 'dark_mode';

        document.body.classList.toggle('darkMode');
      }
    }
  }

  private changeGrid(): EventListenerOrEventListenerObject {
    let isGridMode: boolean = true;
    const gridSwitcher: HTMLButtonElement = document.querySelector('#grid-switcher') as HTMLButtonElement;
    const mainContainer: HTMLDivElement = document.querySelector('.main__container') as HTMLDivElement;
    return function (event: Event): void {
      if (event.target == gridSwitcher) {
        isGridMode = !isGridMode;
        ((event.target as HTMLButtonElement).firstChild as HTMLSpanElement).textContent = isGridMode ? 'grid_view' : 'view_agenda';

        mainContainer.classList.toggle('main__container_grid');
        for(let currentItem of Array.from(mainContainer.children)) {
          currentItem.classList.toggle('main__item_grid');
        }
      }
    }
  }

  private changeFullscreen(): EventListenerOrEventListenerObject {
    let isFullscreen: boolean = false;
    const fullscreenSwitcher: HTMLButtonElement = document.querySelector('#fullscreen-switcher') as HTMLButtonElement;
    if (!document.fullscreenEnabled) {
      fullscreenSwitcher.style.display = 'none';
    }

    return function (event: Event): void {
      if (document.fullscreenEnabled && event.target == fullscreenSwitcher) {
        isFullscreen = !isFullscreen;
        ((event.target as HTMLButtonElement).firstChild as HTMLSpanElement).textContent = isFullscreen ? 'fullscreen_exit' : 'fullscreen';

        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        }
        else if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  }
}

export default EventListenerManager;
