import Application from './application';

let app: null | Application = null;

async function main() {
  app = new Application;
  app.start();
};

window.addEventListener("load", () => {
  main();
});
