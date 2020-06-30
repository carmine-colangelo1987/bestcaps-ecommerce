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
            <span class="badge badge-warning" id="lblCartCount">0</span>
        </a>
    </div>
    `

document.querySelector('.navbar').innerHTML = navbar;


if (JSON.parse(localStorage.getItem("cart"))) {
    let dynamicIcon
    let productStored = JSON.parse(localStorage.getItem("cart"))
    dynamicIcon = productStored.map(product => product.counter).reduce((total, num) => {
        return total + num
    })
    document.getElementById('lblCartCount').innerHTML = `${dynamicIcon}`;
}

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
    init(json);

}).catch(err => {
    console.log(err);
});

function init(object) {
    Object.keys(object).forEach(item => createListName(item));
    function createListName(item) {
        let listItem = `
        <div class="category mt-5 text-center"><span class="line first-color-bg"></span><h3 class="first-color">${item}</h3><span class="line first-color-bg"></span></div>
        <div id="${item}" class="cards-wrapper row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
        
        ${productCard(Object.values(object[item]))}
        
        </div>`
        let listItemQuery = document.querySelector('.list-item');
        if (!!listItemQuery)
        document.querySelector('.list-item').innerHTML += listItem;
    }
}

//crea un array composto dal numero totale dei singoli prodotti
let numbersProduct = [];

//array in cui mettere i prodotti selezionati
let cart = [];

if("cart" in localStorage) {
    cart = JSON.parse(localStorage.getItem("cart"))
}

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
    localStorage.setItem(`cart`, JSON.stringify(cart));
    console.log(localStorage.cart)
    sommaNumArt()
}

//funzione che aggiunge +1 al numero totale del prodotto
function add(id) {
    let index = numbersProduct.findIndex(product => product.prodId === id);
    let addOne = numbersProduct[index].counter + 1;
    numbersProduct[index].counter = addOne;
    document.getElementById(id).setAttribute("value", `${addOne}`);
}

//funzione che toglie-1 al numero totale del prodotto fino ad arrivare a 0
function minus(id) {
    let index = numbersProduct.findIndex(product => product.prodId === id);
    if (numbersProduct[index].counter > 0) {
        let minOne = numbersProduct[index].counter - 1;
        numbersProduct[index].counter = minOne;
        document.getElementById(id).setAttribute("value", `${minOne}`);
    }
}

function productCard(item) {
    let x
    let productCard = ''

    for (x = 0; x < Object.values(item).length; x++) {
        //formatta il prezzo json in un formato utile
        let n = item[x].prezzo / 1000;

        //crea un id univoco per ogni singolo prodotto
        let currentProdId = item[x].nome.replace(/\./g, '').replace(/ /g, '') + item[x].id;

        //crea i singoli elmenti dell'array per fare i singoli counter dei prodotti
        let productObject = { prodId: currentProdId, counter: 0, nome: item[x].nome, prezzo: item[x].prezzo, capsule: item[x].capsule, dose: item[x].dose, rating: item[x].rating};
        numbersProduct.push(productObject)

        //crea ogni singola card
        productCard += `        
            <div class="col mb-4 product text-center mt-5">
                <div class="card">
                    <img src="imgs/ph-sport.jpg" class="card-img-top product-image" alt="ph-sport pills">
                    <div class="card-body">
                        <h5 class="card-title title mt-4 first-color">${item[x].nome}</h5>
                        <p class="card-text text">Questo prodotto è ottimo per allenarsi</p>
                        <p class="card-text quantity"><small class="text-muted pills">Quantità: ${item[x].capsule} capsule</small></p>
                        <p class="card-text"><small class="text-muted days">Dose giornaliera:  ${item[x].dose}</small></p>
                        <div class="stars">
            
            ${createStar(item[x].rating)}
            
            </div>
                        <h5 class="card-title price second-color">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)}</h5>                    
                    </div>
                    <div class="card-footer card-footer-product">
                        <small class="text-left pr-3 pl-1">Aggiungi al carrello</small>
                        <div class="trolley ml-md-0">

                            <div class="trolley-quantity fourth-color-bg">
                                <input type="number" name="number" min="0" max="1000" value="0" class="trolley-number" id="${currentProdId}">
                                <i class="fas fa-plus-square plus third-color" onclick="add('${currentProdId}')" ></i>
                                <i class="fas fa-minus-square minus third-color" onclick="minus('${currentProdId}')"></i>
                            </div>
                            <div class="trolley-icon second-color-bg"><i class="fas fa-shopping-cart" aria-hidden="true" onclick="moveToCart('${currentProdId}')"></i></div>

                        </div>
                    </div>
                </div>
            </div>
        `
    }
    return productCard;

    /*
                            onclick="this.parentNode.querySelector('[type=number]').stepUp();"
                            onclick="this.parentNode.querySelector('[type=number]').stepDown();"
                            <div class="trolley-number d-flex align-items-center justify-content-center" id="${currentProdId}"></div>
                            <div class="trolley-add"><i class="fas fa-plus-square" onclick="add('`+currentProdId+`')"></i><i class="fas fa-minus-square" onclick="minus('`+currentProdId+`')"></i></div>
                            <div class="trolley-icon"><i class="fas fa-shopping-cart" aria-hidden="true" onclick="moveToCart('`+currentProdId+`')"></i></div>
    */
}

//funzione che aggiunge le stelle ai singoli prodotti
function createStar(s) {
    let star = ''
    for (i = 0; i < s; i++) {
        star += `<i class="fas fa-star p-1 text-white first-color-bg"></i>`
    }
    return star;
}

/*array in cui mettere i prodotti selezionati
let productSelected = ['prova', 'prova']

function productNumber() {
    document.getElementById('lblCartCount').innerHTML = `${productSelected.length}`;
}*/

/*
funzione per il numero dei prodotti selezionati da visualizzare sull'icona del carrello
probabilmente andrà inserita all'interno della funzione che verrà richiamata al click del pulsante
"aggiungi al carrello" del singolo prodotto, così da aggiornare di volta in volta il numero totale
nell'icona
*/
function sommaNumArt() {
    let dynamicIcon 
    let productStored = JSON.parse(localStorage.getItem("cart"))
    if (productStored.length === 1) {
        dynamicIcon = `${productStored[0].counter}`
    } else {
        
        dynamicIcon = productStored.map(product => product.counter).reduce((total, num) => {
            return total + num
        })
    }
    console.log(dynamicIcon)
    document.getElementById('lblCartCount').innerHTML = `${dynamicIcon}`;
}


//Carrello

if (!!document.querySelector('.trolley-page')) {
    //svuota carrello
    let dynamicIcon 
    let productStored = JSON.parse(localStorage.getItem("cart"))

    if ('cart' in localStorage) {
    dynamicIcon = productStored.map(product => product.counter).reduce((total, num) => {
        return total + num
    })} else {
        dynamicIcon = 0;
    }

    let emptyTrolley = `
        <div class="first-card-trolley card card-trolley mb-3 fourth-color-bg">
            <div class="delete-products p-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
                <h6 class="elements third-color m-md-0 mb-4 text-center text-md-left">Sono presenti<span class="num-elements"> ${dynamicIcon} </span>articoli nel carrello</h6>
                <h6 class="remove first-color m-0 text-right font-weight-bold" onclick="empty()"><i class="fas fa-times pr-2"></i>Svuota carrello</h6>
            </div>
        </div>
        
        <div class="cards-trolley">        
        
        </div>`

    document.querySelector('.main-trolley-container').innerHTML += emptyTrolley;

    //prodotti aggiunti --> aggiungere forEach
    if('cart' in localStorage) { 
    for (i = 0; i < JSON.parse(localStorage.getItem("cart")).length; i++) {
        let productStored = JSON.parse(localStorage.getItem("cart"))[i]
        let n = productStored.prezzo / 1000;
        let addedProducts = `
            
            <div id="${productStored.id}" class="card card-trolley mb-3 fourth-color-bg">
                <div class="trolley-align text-center text-md-left row no-gutters">
                    <div class="col-md-4">
                        <img src="imgs/ph-sport.jpg" class="card-img" alt="product">
                    </div>
                    <div class="col-md-8">
                        <div class="row no-gutters general-wrapper">
                            <h6 class="second-color font-weight-bold remove-product p-2" onclick="productRemove(${i})"><i class="fas fa-times pr-2"></i>Remove</h6>
                            <div class="trolley-card-body col-md-9">
                                <div class="card-body">
                                    <h5 class="card-title first-color">${productStored.nome}</h5>
                                    <p class="card-text">Questo prodotto è ottimo per allenarsi</p>
                                    <p class="card-text quantity"><small class="text-muted pills">Quantità: ${productStored.capsule} capsule</small></p>
                                    <p class="card-text"><small class="text-muted days">Durata: ${Math.floor(productStored.capsule / productStored.dose)} giorni</small></p>
                                    <h5 class="card-title price second-color m-0">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n)}</h5>   
                                </div>                 
                            </div>
                            <div class="how-many col-md-1">
                                <div class="trolley ml-md-0">
                                    <div class="trolley-quantity">
                                        <input type="number" name="number" min="0" max="1000" value="${productStored.counter}" class="trolley-number">
                                        <i class="fas fa-plus-square plus third-color" onclick="this.document.querySelector('[type=number]').stepUp();"></i>
                                        <i class="fas fa-minus-square minus third-color" onclick="this.parentNode.querySelector('[type=number]').stepDown();"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`

        
        document.querySelector('.cards-trolley').innerHTML += addedProducts;
    }}

    //funzione svuota carrello
    function empty() {
        
        localStorage.clear();
        location.reload();
        
        /*
        document.querySelector('.cards-trolley').innerHTML = '';
        document.querySelector('.num-elements').innerHTML = ' 0 ';
        document.querySelector('.prices-wrapper').innerHTML = '';
        document.querySelector('.tot-to-pay').innerHTML = '0 €';
        document.querySelector('.remove').innerHTML = '';
        */
    }

    //rimuovere prodotto
    function productRemove(){
        document.querySelector('.cards-trolley').remove();
    }

    //totale da pagare
    if ('cart' in localStorage) {
        let totalPrice = 0

        for (i = 0; i < JSON.parse(localStorage.getItem("cart")).length; i++) {
            let productStored = JSON.parse(localStorage.getItem("cart"))[i]
            let n = productStored.prezzo/1000
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
    

    
    //prezzi prodotti da sommare
    if('cart' in localStorage) { 
        for (i = 0; i < JSON.parse(localStorage.getItem("cart")).length; i++) {
            let productStored = JSON.parse(localStorage.getItem("cart"))[i]
            let n = productStored.prezzo / 1000;
            let prices = `
                <div class="prices d-flex justify-content-between align-items-center">
                <h7 class="first-color">${productStored.nome}</h7><h7 class="second-color">${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n*productStored.counter)}</h7>
                </div>`
            document.querySelector('.prices-wrapper').innerHTML += prices;
            }
    }
}
