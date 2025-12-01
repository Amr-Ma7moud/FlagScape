// import { embedHTML } from "../util/utils.js"
console.log("was here")
console.log(document.getElementById("continents"))
document.getElementById("continents").children.forEach( continent=> {
    console.log("Hello EVENT ")
    continent.addEventListener('click', () => {
        console.log("Hello EVENT ")
        embedHTML("map", continent.id )
    });
});