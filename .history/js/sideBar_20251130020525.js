import { embedHTML } from "/util/utils.js"
document.getElementById("continents").children.forEach( continent=> {
    continent.addEventListener('click', () => {
        embedHTML("map", continent.id )
    });
});