//crea un oggetto composto dal json
let numbersProduct = {};

//oggetto in cui mettere i prodotti selezionati
let cart = {};

//Navbar
let navbar = `
    <a class="navbar-brand" href="index.html">
        <img src="img/logo.svg" width="150" height="50" class="d-inline-block align-top" alt="">
    </a>
    <div class="navbar-nav ml-auto flex-row">
        <a href="#" class="nav-item nav-link px-2"><i class="fas fa-user fifth-color"></i></a>
        <a href="#" class="nav-item nav-link px-2"><i class="fas fa-heart fifth-color"></i></a>
        <a href="trolley.html" class="nav-item nav-link px-2">
            <i class="fas fa-shopping-cart fifth-color"></i>
            <span class="badge badge-warning" id="badgeIcon">0</span>
        </a>
    </div>
    `

document.querySelector('.navbar').innerHTML = navbar;

//Chiamata
fetch('https://my-json-server.typicode.com/sarhita92/catalogue/db').then(result => {
    console.dir(result)
    if (result.ok) {
        if (result.headers.get('Content-Type').includes('application/json')) {
            return result.json()
        }
        throw new Error('response type is not json');

    } else {
        throw new Error('response failed');
    }
}).then(json => {
    console.log(json);
    numbersProduct = json;
    init();

}).catch(err => {
    console.log(err);
});

function init() {
    Object.keys(numbersProduct).forEach(category => {
        createListName(category)
    });

    function createListName(item) {
        let listItem = `
        <div class="category mt-5 text-center"><span class="line first-color-bg"></span><h3 class="first-color">${item}</h3><span class="line first-color-bg"></span></div>
        <div id="${item}" class="cards-wrapper row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        
        ${productCard(item)}
        
        </div>`
        let listItemQuery = document.querySelector('.list-item');
        if (!!listItemQuery)
            document.querySelector('.list-item').innerHTML += listItem;
    }
    updateBadgeIcon()
}

/**
 * Manage local storage easy
 * se passi due argomenti, setti. se passi solo il primo argomento, recuperi!
 * @param {*} key 
 * @param {*} value 
 */
function ls(key, value = null) {
    if (value) {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        debugger
        const result = localStorage.getItem(key);
        return result ? JSON.parse(result) : result
    } 
}

function moveToCart(prodId, categoryName, indexOfProduct) {
    const inputElementWithValue = document.getElementById(prodId)
    const value = Number(inputElementWithValue.value);
    console.log(categoryName)
    console.log(indexOfProduct)
    console.log(numbersProduct)
    const product = numbersProduct[categoryName][indexOfProduct];
    let cloneOfCart = ls('cart') || {};
    
    if(cloneOfCart.hasOwnProperty(prodId)){
        cloneOfCart[prodId].counter += value;
        console.log(product)
    } else {
        cloneOfCart[prodId] = {
            ...product,
            counter: value
        }
    } 
    
    ls('cart', cloneOfCart);
    console.log(localStorage)
    updateBadgeIcon()
    inputElementWithValue.value = 0;
}


//funzione per il numero dei prodotti selezionati da visualizzare sull'icona del carrello
function updateBadgeIcon() {
    const cart = ls('cart'); // se c'è un carrello nel local storage, sommo tutti i valori dei vari counter
    let badgeIcon = 0; // valore di default del numerino nel carrello

    if(cart) {
        badgeIcon = Object.values(cart)
            .map(productInCart => productInCart.counter) // a noi serve un array di numeri non di oggetti
            .reduce((total, num) => total + num) // a noi serve un array di numeri non di oggetti
    }

    document.getElementById('badgeIcon').innerHTML = badgeIcon;
}

//funzione che aggiunge +1 al numero totale del prodotto
function add(id) {
    const value = Number(document.getElementById(id).value);
    document.getElementById(id).value = value + 1;
}

//funzione che toglie-1 al numero totale del prodotto fino ad arrivare a 0
function minus(id) {
    const value = Number(document.getElementById(id).value);
    document.getElementById(id).value = value - 1;
}

function productCard(itemKey) {
    let productCard = ''
    const listOfProducts = numbersProduct[itemKey];
    listOfProducts.forEach( (product, indexOfArray) => {
        //formatta il prezzo json in un formato utile
        const n = product.prezzo / 1000;

        //crea un id univoco per ogni singolo prodotto
        const currentProdId = product.nome.replace(/\./g, '').replace(/ /g, '') + product.id;

        //crea ogni singola card
        productCard += `        
            <div class="col mb-4 product text-center mt-5">
                <div class="card">
                    <img src="imgs/ph-sport.jpg" class="card-img-top product-image" alt="ph-sport pills">
                    <div class="card-body">
                        <h5 class="card-title title mt-4 first-color">${product.nome}</h5>
                        <p class="card-text text">Questo prodotto è ottimo per allenarsi</p>
                        <p class="card-text quantity"><small class="text-muted pills">Quantità: ${product.capsule} capsule</small></p>
                        <p class="card-text"><small class="text-muted days">Dose giornaliera:  ${product.dose}</small></p>
                        <div class="stars">
                            ${createStar(product.rating)}
                        </div>
                        <h5 class="card-title price second-color">
                            ${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)}
                        </h5>                    
                    </div>
                    <div class="card-footer card-footer-product">
                        <small class="text-left pr-3 pl-1">Aggiungi al carrello</small>
                        <div class="trolley ml-md-0">
                            ${productCounter(currentProdId)}
                            <div class="trolley-icon second-color-bg"><i class="fas fa-shopping-cart" aria-hidden="true" onclick="moveToCart('${currentProdId}', '${itemKey}', '${indexOfArray}')"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        `
    })
    
    return productCard; 
}

/**
 * stampa l'input per il contatore dei prodotti
 * @param {*} currentProdId 
 */
function productCounter(currentProdId, counter = 0) {
    return `
    <div class="trolley-quantity fourth-color-bg">
        <input type="number" name="number" min="0" max="1000" value="${counter}" class="trolley-number" id="${currentProdId}">
        <i class="fas fa-plus-square plus third-color"  onclick="add('${currentProdId}')" ></i>
        <i class="fas fa-minus-square minus third-color" onclick="minus('${currentProdId}')"></i>
    </div>`
}

//funzione che aggiunge le stelle ai singoli prodotti
function createStar(s) {
    let star = ''
    for (i = 0; i < s; i++) {
        star += `<i class="fas fa-star p-1 text-white first-color-bg"></i>`
    }
    return star;
}


/*----------------------------------------
|funzione che crea una modale di conferma|
----------------------------------------*/
function modal(){
    return `
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Ehi! Presta MOLTA attenzione!</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Stai per eliminare un prodotto dal carrello.<br><br>
                E se poi te ne penti?</p>
            </div>
            <div class="modal-footer" id="modalId">
                
            </div>
            </div>
        </div>
        </div>
    `
}

/*----------------------------------------
|funzione che crea i bottoni della modale|
----------------------------------------*/
function modalButton(i) {
    debugger

    let buttons = `
                <button type="button" class="btn btn-primary" onclick="productRemove('${i}')">Voglio rischiare! Rimuovilo!</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">...hai ragione!</button>
    `

    document.getElementById('modalId').innerHTML = buttons;
}

//Carrello

/*------------------------------------
|if che crea tutta la pagina carrello|
------------------------------------*/
if (!!document.querySelector('.trolley-page')) {

    /*------------------------------------------------------------------
    |se la pagina è trolley.html imposta la struttura html del carrello|
    ------------------------------------------------------------------*/
    let dynamicIcon
    let productStored = JSON.parse(localStorage.getItem("cart"))

    if ('cart' in localStorage && productStored.length > 0) {
    dynamicIcon = productStored.map(product => product.counter).reduce((total, num) => {
        return total + num
    })} else {
        dynamicIcon = 0;
    }

    let emptyTrolley = `
        
        ${modal()}
    
        <div class="first-card-trolley card card-trolley mb-3 fourth-color-bg">
            <div class="delete-products p-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
                <h6 class="elements third-color m-md-0 mb-4 text-center text-md-left">Sono presenti<span class="num-elements"> ${dynamicIcon} </span>articoli nel carrello</h6>
                <h6 class="remove first-color m-0 text-right font-weight-bold" onclick="empty()"><i class="fas fa-times pr-2"></i>Svuota carrello</h6>
            </div>
        </div>
        <div class="cards-trolley">
        </div>`

    document.querySelector('.main-trolley-container').innerHTML += emptyTrolley;

    //prodotti aggiunti
    if ('cart' in localStorage) {
        for (i = 0; i < JSON.parse(localStorage.getItem("cart")).length; i++) {
            let productStored = JSON.parse(localStorage.getItem("cart"))[i]
            let n = productStored.prezzo / 1000;

            //<h6 class="second-color font-weight-bold remove-product p-2" onclick="productRemove('${i}')"><i class="fas fa-times pr-2"></i>Remove</h6>


            let addedProducts = `
            
            <div id="${productStored.prodId}" class="card card-trolley mb-3 fourth-color-bg">
                <div class="trolley-align text-center text-md-left row no-gutters">
                    <div class="col-md-4">
                        <img src="imgs/ph-sport.jpg" class="card-img" alt="product">
                    </div>
                    <div class="col-md-8">
                        <div class="row no-gutters general-wrapper">
                            <h6 class="second-color font-weight-bold remove-product p-2" data-toggle="modal" data-target="#exampleModalCenter" onclick="modalButton('${i}')"><i class="fas fa-times pr-2"></i>Remove</h6>
                            <div class="trolley-card-body col-md-9">
                                <div class="card-body">
                                    <h5 class="card-title first-color">${productStored.nome}</h5>
                                    <p class="card-text">Questo prodotto è ottimo per allenarsi</p>
                                    <p class="card-text quantity"><small class="text-muted pills">Quantità: ${productStored.capsule * productStored.counter} capsule</small></p>
                                    <p class="card-text"><small class="text-muted days">Durata: ${Math.floor((productStored.capsule * productStored.counter) / productStored.dose)} giorni</small></p>
                                    <h5 class="card-title price second-color m-0">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n * productStored.counter)}</h5>   
                                </div>                 
                            </div>
                            <div class="how-many col-md-1">
                                <div class="reload ml-md-0">
                                    ${productCounter(productStored.prodId, productStored.counter)}
                                    <div class="reload-icon second-color-bg"><i class="fas fa-redo-alt" aria-hidden="true" onclick="moveToCart('${productStored.prodId}')"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`

            document.querySelector('.cards-trolley').innerHTML += addedProducts;
        }
    }

    /*----------------------------------------------------
    Funzione che svuota l'intero carrello in local storage
    ----------------------------------------------------*/
    function empty() {
        localStorage.clear();
        location.reload();
    }
    /*-------------------------------------
    All'onclick rimuove il singolo prodotto
    -------------------------------------*/
    function productRemove(x){

        let productStored = JSON.parse(localStorage.getItem("cart"))
        if (productStored.length > 1) {
            productStored.splice(x, 1);
            localStorage.setItem(`cart`, JSON.stringify(productStored))
        } else {
            localStorage.clear();
        }
        location.reload();
    }

    /*----------------------------------------
    |funzione che calcola il totale da pagare|
    ----------------------------------------*/
    if ('cart' in localStorage) {
        let totalPrice = 0

        for (i = 0; i < JSON.parse(localStorage.getItem("cart")).length; i++) {
            let productStored = JSON.parse(localStorage.getItem("cart"))[i]
            let n = productStored.prezzo / 1000
            totalPrice += n * productStored.counter;
        }

        let tot = `
        <div class="card fourth-color-bg p-4">
        <div class="prices-wrapper">
            
        </div>
        <div class="trolley-tot d-flex justify-content-between align-items-center">
            <h5 class="first-color font-weight-bold">TOT</h5><h5 class="second-color tot-to-pay font-weight-bold">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(totalPrice)}</h5>
        </div>
        <button class="btn go-to-pay first-color-bg mt-3"><h5 class="text-uppercase m-0 p-2 fourth-color">vai alla cassa</h5></button>
        </div>`
        document.querySelector('.main-tot-prices').innerHTML += tot;
    } else {
        let tot = `
        <div class="card fourth-color-bg p-4">
        <div class="prices-wrapper">
            
        </div>
        <div class="trolley-tot d-flex justify-content-between align-items-center">
            <h5 class="first-color font-weight-bold">TOT</h5><h5 class="second-color tot-to-pay font-weight-bold">0 €</h5>
        </div>
        <button class="btn go-to-pay first-color-bg mt-3"><h5 class="text-uppercase m-0 p-2 fourth-color">vai alla cassa</h5></button>
        </div>`
        document.querySelector('.main-tot-prices').innerHTML += tot;
    }

    /*--------------------------------------
    Prezzi prodotti da sommare
    --------------------------------------*/
    if ('cart' in localStorage) {
        for (i = 0; i < JSON.parse(localStorage.getItem("cart")).length; i++) {
            let productStored = JSON.parse(localStorage.getItem("cart"))[i]
            let n = productStored.prezzo / 1000;
            let prices = `
                <div class="prices d-flex justify-content-between align-items-center">
                <h7 class="first-color">${productStored.nome}</h7><h7 class="second-color">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n * productStored.counter)}</h7>
                </div>`
            document.querySelector('.prices-wrapper').innerHTML += prices;
        }
    }
}