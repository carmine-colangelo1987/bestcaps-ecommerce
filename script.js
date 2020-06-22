let productsArray = [
    {id: 1, title: 'Ph Sport', description: 'Queste pillole fanno bene per allenarsi', quantity: '200', duration: '100', review: 'Good product!', price: '12,50', stars: 4},
    {id: 2, title: 'Ph Sport', description: 'Queste pillole fanno bene per allenarsi', quantity: '200', duration: '100', review: 'Good product!', price: '12,50', stars: 4},
    {id: 3, title: 'Ph Sport', description: 'Queste pillole fanno bene per allenarsi', quantity: '200', duration: '100', review: 'Good product!', price: '12,50', stars: 4},
    {id: 4, title: 'Ph Sport', description: 'Queste pillole fanno bene per allenarsi', quantity: '200', duration: '100', review: 'Good product!', price: '12,50', stars: 4} 
]

productsArray.forEach(item => data(item));
function data(item){
    let productCard = `
    <div class="col mb-4 product">
            <div class="card">
                <img src="imgs/ph-sport.jpg" class="card-img-top" alt="ph-sport pills">
                <div class="card-body">
                    <h5 class="card-title title">${item.title}</h5>
                    <p class="card-text text">${item.description}</p>
                    <p class="card-text"><small class="text-muted pills">Quantità: ${item.quantity}</small></p>
                    <p class="card-text"><small class="text-muted days">Durata contenitore: ${item.duration} giorni</small></p>
                    <div class="reviews">
                        <div class="stars"></div>
                        <small class="text-muted">${item.review}</small>
                    </div>
                    <h5 class="card-title price">${item.price} €</h5>                    
                </div>
                <div class="card-footer card-footer-product">
                    <small class="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
        </div>` 
    document.querySelector('.cards-wrapper').innerHTML = productCard;   
}

productsArray.stars.forEach(item => stars());
function stars(){
    let starsReview = `<span class="star"><i class="fas fa-star"></i></span>` 
    document.querySelector('.stars').innerHTML += starsReview;   
}