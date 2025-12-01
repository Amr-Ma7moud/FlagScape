import { embedHTML } from "./util/utils.js"

embedHTML("head", "js/htmlUtil/head.html")
embedHTML("header", "js/htmlUtil/header.html")
embedHTML("sideBar", "js/htmlUtil/sideBar.html")
embedHTML("map", "js/htmlUtil/map.html")

function displayMap(){
  fetch('assets/world.svg')
    .then(res => res.text())
    .then(svgData => {
      document.getElementById('map-container').innerHTML = svgData;

      document.querySelectorAll('path').forEach(country => {
        country.addEventListener('click', () => {
          const name = country.getAttribute('title') || 'Unknown';
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