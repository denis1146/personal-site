document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.slider');
  const options = {
    duration: 1000,
    interval: 4000,
  }
  const instances = M.Slider.init(elems, options);
});
