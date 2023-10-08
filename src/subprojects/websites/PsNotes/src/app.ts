import Application from './application';

async function main() {
  const app = new Application;
  app.start();
};

window.addEventListener("load", event => {
  main();
});
