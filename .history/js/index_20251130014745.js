import { embedHTML } from "../util/utils.js"

embedHTML("head", "/htmlUtil/head.html")
embedHTML("header", "/htmlUtil/header.html")
embedHTML("sideBar", "/htmlUtil/sideBar.html")
embedHTML("map", "/htmlUtil/map.html")
embedHTML("fab", "/htmlUtil/fab.html").then(() => {
  console.log(document.getElementById("hekal"))
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