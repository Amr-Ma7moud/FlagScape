import { embedHTML } from "../util/utils.js"
document.getElementById("continents").children.forEach( continent=> {
    continent.addEventListener('click', () => {
        console.log("Hello EVENT ")
        embedHTML("map", continent.id )
    });
});