async function main() {
  { // item_1 and btn_1
    let isDark = false;
    const backgroundColor = () => isDark ? 'rgb(42, 42, 42)' : 'rgb(242, 242, 242)';
    const fontColor = () => isDark ? 'rgb(255, 55, 29)' : 'rgb(42, 42, 42)';

    const item_1 = document.querySelector('#item_1');
    const btn_1 = document.querySelector('#btn_1');
    item_1.style.backgroundColor = backgroundColor();
    item_1.style.color = fontColor();

    btn_1.onclick = () => {
      isDark = !isDark;
      item_1.style.backgroundColor = backgroundColor();
      item_1.style.color = fontColor();
    };
  }

  { // item_2 and btn_2
    let isDark = false;
    const btn_2 = document.querySelector('#btn_2');
    const toggleTheme = () => {
      isDark = !isDark;
      let link = document.createElement("link");
      const id = 'theme';
      link.id = id;
      link.rel = 'stylesheet';
      link.href = `styles/themes/${isDark ? 'dark' : 'light'}.css`;

      let currentTheme = document.querySelector(`#${id}`);
      if (currentTheme) {
        currentTheme.replaceWith(link);
      }
      else {
        document.head.append(link);
      }
    }

    // Synchronization
    toggleTheme();
    toggleTheme();

    btn_2.onclick = () => {
      toggleTheme();
    }
  }

  { // item_3 and btn_3
    const item_3 = document.querySelector('#item_3');
    const btn_3 = document.querySelector('#btn_3');

    const toggleTheme = () => {
      item_3.classList.toggle('themeLight_3');
      item_3.classList.toggle('themeDark_3');
    }

    btn_3.onclick = () => {
      toggleTheme();
    }
  }

  { // item_4 and btn_4
    const item_4 = document.querySelector('#item_4');
    const btn_4 = document.querySelector('#btn_4');

    const toggleTheme = () => {
      item_4.classList.toggle('themeDark_4');
    }

    btn_4.onclick = () => {
      toggleTheme();
    }
  }
};

window.addEventListener("load", event => {
  main();
});
