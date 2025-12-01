export const embedHTML = async function(id, file) {
    const el = document.getElementById(id);
    const response = await fetch(file);
    el.innerHTML = await response.text();
};

