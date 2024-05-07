let suche = document.querySelector ('#suche');
let anzeige = document.querySelector ('#anzeige');


//Daten holen von API
async function holeDaten (url) {
    try {
let data = await fetch(url);
return await data.json();
    } catch (e) {
        console.error(e);
    }
}
let cocktailDaten = await holeDaten ('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
console.log(cocktailDaten);


//looping:
function datenDarstellen(cocktails) {
    anzeige.innerHTML= '';
    cocktails.forEach(cocktail => {
        let div = document.createElement ('div');
        let image = document.createElement ('img');
        image.src = cocktail.strDrinkThumb;
        let title = document.createElement('h2');
        title.innerText = cocktail.strDrink;
        div.appendChild(title);
        div.appendChild (image);
        anzeige.appendChild(div);             
   } )
}
datenDarstellen(cocktailDaten.drinks);

suche.addEventListener ('input', async function() {
    let ergebnis = suche.value;
    let searchUrl= 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + ergebnis;
    console.log(ergebnis);  
    let cocktails_aus_suche = await holeDaten(searchUrl);
    datenDarstellen(cocktails_aus_suche.drinks)
    console.log(cocktails_aus_suche);

})