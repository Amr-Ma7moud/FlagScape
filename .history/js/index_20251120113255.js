function displayMap(){
  fetch('assets/world.svg')
    .then(res => res.text())
    .then(svgData => {
      document.getElementById('map-container').innerHTML = svgData;
    })
    .catch(err => console.error('Failed to load world.svg', err));
}

document.querySelectorAll('path').forEach(country => {
  country.addEventListener('click', () => {
    const name = country.getAttribute('title') || 'Unknown';
    alert(`You clicked on ${name}`);
  });
});

console.log(document.querySelectorAll("path"))

document.querySelectorAll("nav-item").forEach(item => {
  item.addEventListener('click', () => {
    alert(`You clicked on ${item.textContent}`);
  });
});

displayMap()