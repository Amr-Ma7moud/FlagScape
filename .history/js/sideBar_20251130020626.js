import { embedHTML } from "../util/utils"
document.getElementById("continents").children.forEach( continent=> {
    continent.addEventListener('click', () => {
        embedHTML("map", continent.id )
    });
});