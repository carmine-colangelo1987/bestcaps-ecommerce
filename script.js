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

//crea un array composto dal numero totale dei singoli prodotti
let numbersProduct = [];

//array in cui mettere i prodotti selezionati
let cart = [];

function moveToCart(id) {
    let index = numbersProduct.findIndex(product => product.prodId === id);
    let prodobj = {};
    Object.assign(prodobj, numbersProduct[index]);

    if (cart.length > 0) {
        let index = cart.findIndex(product => product.prodId === id)        
        if (index >=0) {
            cart[index].counter += prodobj.counter
        } else {
            cart.push(prodobj)
        }
    } else {
            cart.push(prodobj)
    }  
    console.log(cart)
    sommaNumArt()
}

//funzione che aggiunge +1 al numero totale del prodotto
function add(id) {
    let index = numbersProduct.findIndex(product => product.prodId === id);
    let addOne = numbersProduct[index].counter + 1;
    numbersProduct[index].counter = addOne;
    document.getElementById(id).innerHTML = addOne;
}

//funzione che toglie -1 al numero totale del prodotto fino ad arrivare a 0
function minus(id) {
    let index = numbersProduct.findIndex(product => product.prodId === id);
    if (numbersProduct[index].counter > 0) {
    let minOne = numbersProduct[index].counter - 1;
    numbersProduct[index].counter = minOne;
    document.getElementById(id).innerHTML = minOne;
    }
}

function productCard(item){
    let x
    let productCard = ''
    
    for (x=0; x<Object.values(item).length; x++) {
        //formatta il prezzo json in un formato utile
        let n = item[x].prezzo / 1000;

        //crea un id univoco per ogni singolo prodotto
        let currentProdId = item[x].nome.replace(/\./g,'').replace(/ /g,'')+item[x].id;

        //crea i singoli elmenti dell'array per fare i singoli counter dei prodotti
        let productObject = {prodId : currentProdId, counter: 0};
        numbersProduct.push(productObject)

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
                        <h5 class="card-title price second-color">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR'}).format(n)}</h5>                    
                    </div>
                    <div class="card-footer card-footer-product">
                        <small class="text-muted pr-3">Aggiungi al carrello</small>
                        <div class="trolley">
                            <div class="trolley-number d-flex align-items-center justify-content-center" id="${currentProdId}">0</div>
                            <div class="trolley-add"><i class="fas fa-plus-square" onclick="add('`+currentProdId+`')"></i><i class="fas fa-minus-square" onclick="minus('`+currentProdId+`')"></i></div>
                            <div class="trolley-icon"><i class="fas fa-shopping-cart" aria-hidden="true" onclick="moveToCart('`+currentProdId+`')"></i></div>
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
//let productSelected = ['prova', 'prova']

/*
funzione per il numero dei prodotti selezionati da visualizzare sull'icona del carrello
probabilmente andrà inserita all'interno della funzione che verrà richiamata al click del pulsante
"aggiungi al carrello" del singolo prodotto, così da aggiornare di volta in volta il numero totale
nell'icona
*/
function productNumber() {
    document.getElementById('lblCartCount').innerHTML = `${productSelected.length}`;
}

function sommaNumArt() {
    let dynamicIcon
    if (cart.length === 1) {
        dynamicIcon = `${cart[0].counter}`
    } else {
    dynamicIcon = cart.map(product => product.counter).reduce((total, num) => {
        return total + num
    })}
        console.log(dynamicIcon)
        document.getElementById('lblCartCount').innerHTML = `${dynamicIcon}`;
}