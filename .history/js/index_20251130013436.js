import { embedHTML } from "../util/utils.js"

embedHTML("head", "/htmlUtil/head.html")
embedHTML("header", "/htmlUtil/header.html")
embedHTML("sideBar", "/htmlUtil/sideBar.html")
embedHTML("map", "/htmlUtil/map.html")
embedHTML("fab", "/htmlUtil/fab.html").then(() => {
  // Debug the FAB buttons
  const fabContainer = document.getElementById('fab');
  console.log('FAB Container HTML:', fabContainer.innerHTML);
  const spans = fabContainer.querySelectorAll('.github-fab span');
  console.log('Found spans:', spans.length);
  spans.forEach((span, i) => {
    console.log(`Span ${i}:`, span.textContent, 'Display:', window.getComputedStyle(span).display);
  });
})

function displayMap( mapUri = "world.svg" ){
  fetch(`assets/${mapUri}`)
    .then(res => res.text())
    .then(svgData => {
      document.getElementById('map-container').innerHTML = svgData;

      document.querySelectorAll('path').forEach(country => {
        country.addEventListener('click', (e) => {
          const name = country.getAttribute('title') || 'Unknown';
          // country.style.scale = 100;

          alert(`You clicked on ${name}`);
        });
      });
    })
    .catch(err => console.error('Failed to load world.svg', err));
}

document.querySelectorAll("nav-item").forEach(item => {
  item.addEventListener('click', () => {
    alert(`You clicked on ${item.textContent}`);
  });
});

displayMap()