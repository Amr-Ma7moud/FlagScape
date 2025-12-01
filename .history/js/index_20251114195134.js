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


let c = fetch('js/util/countries.json')
.then(res => res.json()).then(data => {
  console.log(data);
});

document.querySelectorAll("nav-item").forEach(item => {
  item.addEventListener('click', () => {
    alert(`You clicked on ${item.textContent}`);
  });
});

displayMap()