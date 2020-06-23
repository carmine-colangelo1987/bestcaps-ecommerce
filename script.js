//Chiamata
fetch('https://my-json-server.typicode.com/sarhita92/catalogue/db').then(result => {
    console.dir(result)
    if(result.ok){
      if( result.headers.get('Content-Type').includes('application/json')){
        return result.json()
      } 
      throw new Error('response type is not json');

    } else {
        throw new Error('response failed');
    }
}).then( json =>{
    console.log(json);
    init(json);    
    
}).catch(err => {
    console.log(err);
});

function init(object){
    Object.keys(object).forEach(item => createListName(item));
    function createListName(item){
        let listItem = `
        <div class="category mt-5 text-center"><span class="line first-color-bg"></span><h3 class="first-color">${item}</h3><span class="line first-color-bg"></span></div>
        <div id="${item}" class="cards-wrapper row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">` 
        
        +

        productCard(Object.values(object[item]))

        +

        `</div>`
        document.querySelector('.list-item').innerHTML += listItem;
    }
}


function productCard(item){
    let x
    let productCard = ''
    for (x=0; x<Object.values(item).length; x++) {
        let n = item[x].prezzo.toString();
        
        let price = n.substring(0, 2) + ',' + n.substr(-3);
        productCard +=`        
            <div class="col mb-4 product text-center mt-5">
                <div class="card">
                    <img src="imgs/ph-sport.jpg" class="card-img-top product-image" alt="ph-sport pills">
                    <div class="card-body">
                        <h5 class="card-title title mt-4 first-color">${item[x].nome}</h5>
                        <p class="card-text text">Questo prodotto è ottimo per allenarsi</p>
                        <p class="card-text quantity"><small class="text-muted pills">Quantità: ${item[x].capsule} pills</small></p>
                        <p class="card-text"><small class="text-muted days">Dose giornaliera:  ${item[x].dose}</small></p>
                        <div class="stars">`
                        +
                        createStar(item[x].rating)
                        +
                        `</div>
                        <h5 class="card-title price second-color">${price} €</h5>                    
                    </div>
                    <div class="card-footer card-footer-product">
                        <small class="text-muted pr-3">Aggiungi al carrello</small>
                        <div class="trolley">
                            <div class="trolley-number"></div>
                            <div class="trolley-add"><i class="fas fa-plus-square" onclick="add()"></i><i class="fas fa-minus-square"></i></div>
                            <div class="trolley-icon"><i class="fas fa-shopping-cart" aria-hidden="true"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
    return productCard;
}

function createStar(s){
    let star = ''
    for (i=0; i<s; i++){
        star += `<i class="fas fa-star p-1 text-white first-color-bg"></i>`
    }
    return star;
}

//array in cui mettere i prodotti selezionati
let productSelected = ['prova', 'prova']

/*
funzione per il numero dei prodotti selezionati da visualizzare sull'icona del carrello
probabilmente andrà inserita all'interno della funzione che verrà richiamata al click del pulsante
"aggiungi al carrello" del singolo prodotto, così da aggiornare di volta in volta il numero totale
nell'icona
*/
function productNumber() {
    document.getElementById('lblCartCount').innerHTML = `${productSelected.length}`;
}