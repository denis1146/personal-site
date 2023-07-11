(async function main() {
  const LOCK_ICON = 'lock';
  const UNLOCK_ICON = 'lock_open_right';
  const LOCK = 'lock';
  const UNLOCK = 'unlock';

  const generateRandomColor = () => {
    let color = '#';
    const length = 6;
    for (let i = 0; i < length; ++i) {
      color += Math.floor(Math.random() * 16).toString(16);
    }
    return color;
  }

  const whiteOrBlack = (color) => {
    return chroma(color).luminance() > 0.5 ? '#020c0cff' : '#f1e0e0ff';
  }

  const copyToClickboard = text => {
    return navigator.clipboard.writeText(text);
  }

  const updateColorsHash = (colors = []) => {
    document.location.hash = colors.map(color => color.slice(1)).join('-');
  }

  const getColorsFromHash = () => {
    const hash = document.location.hash;
    return hash.length ? hash.slice(1).split('-').map(color => '#' + color) : [];
  }

  const updateColors = (colors = []) => {
    const cards = document.querySelectorAll('.card__body');
    if (colors.length != cards.length) {
      colors = [];
      for (let i = 0; i < cards.length; ++i) {
        colors.push(chroma.random().toString()); // generateRandomColor();
      }
    }

    cards.forEach((card, index) => {
      if (card.querySelector('span.button__body_card').textContent === LOCK_ICON) {
        colors[index] = card.querySelector('.card__copy-text').textContent
        return;
      }
      const color = colors[index];

      card.style.background = color;
      card.style.color = whiteOrBlack(color);

      const buttons = card.querySelectorAll('.button__body');
      buttons.forEach(button => {
        button.style.borderColor = whiteOrBlack(color);
      });

      card.querySelector('.card__copy-text').textContent = color;
    });

    updateColorsHash(colors);
  }
  updateColors(getColorsFromHash());


  document.addEventListener('keydown', event => {
    if (['space', 'enter', 'numpadenter', 'f5'].includes(event.code.toLowerCase())) {
      updateColors();
      event.preventDefault();
    }
  });
  const updateBtn = document.querySelector('.button__body_update');
  updateBtn.onclick = _ => updateColors();

  document.addEventListener('click', event => {
    const type = event.target.dataset.type;
    if (type === LOCK && event.target.tagName.toLowerCase() === 'span') {
      console.log(type);
      event.target.textContent = UNLOCK_ICON;
      event.target.dataset.type = UNLOCK;
    }
    else if (type === UNLOCK && event.target.tagName.toLowerCase() === 'span') {
      console.log(type);
      event.target.textContent = LOCK_ICON
      event.target.dataset.type = LOCK;
    }
    else if (type === 'copy') {
      const txt = event.target.parentElement.parentElement.
        parentElement.querySelector('.card__copy-text').textContent;
      copyToClickboard(txt.toUpperCase());
    }
    else if (type === 'text-copy') {
      copyToClickboard(event.target.textContent.toUpperCase());
    }
  });
})();
