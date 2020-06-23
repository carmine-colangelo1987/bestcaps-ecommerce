let productsArray = [
    {id: 1, img: 'ph-sport', title: 'Ph Sport', description: 'Queste pillole fanno bene per allenarsi', quantity: '200', duration: '100', review: 'Very good product!', price: '12,50', stars: 4},
    {id: 2, img: 'ph-sport', title: 'Ph Sport', description: 'Queste pillole fanno bene per allenarsi', quantity: '200', duration: '100', review: 'Very good product!', price: '12,50', stars: 4},
    {id: 3, img: 'ph-sport', title: 'Ph Sport', description: 'Queste pillole fanno bene per allenarsi', quantity: '200', duration: '100', review: 'Very good product!', price: '12,50', stars: 4},
    {id: 4, img: 'ph-sport', title: 'Ph Sport', description: 'Queste pillole fanno bene per allenarsi', quantity: '200', duration: '100', review: 'Very good product!', price: '12,50', stars: 4} 
]

productsArray.forEach(item => data(item));
function data(item){
    let productCard = `
    <div class="col mb-4 product text-center mt-5">
            <div class="card">
                <img src="imgs/${item.img}.jpg" class="card-img-top product-image" alt="ph-sport pills">
                <div class="card-body">
                    <h5 class="card-title title mt-4 text-primary">${item.title}</h5>
                    <p class="card-text text">${item.description}</p>
                    <p class="card-text quantity"><small class="text-muted pills">Quantità: ${item.quantity}</small></p>
                    <p class="card-text"><small class="text-muted days">Durata: ${item.duration} giorni</small></p>
                    <div class="stars">
                        <i class="fas fa-star p-1 text-white bg-primary"></i>
                        <i class="fas fa-star p-1 text-white bg-primary"></i>
                        <i class="fas fa-star p-1 text-white bg-primary"></i>
                        <i class="fas fa-star p-1 text-white bg-primary"></i>
                        <i class="fas fa-star p-1 text-white bg-primary"></i>
                    </div>
                    <small class="reviews">${item.review}</small>
                    <h5 class="card-title price text-primary">${item.price} €</h5>                    
                </div>
                <div class="card-footer card-footer-product">
                    <small class="text-muted pr-3">Aggiungi al carrello</small>
                </div>
            </div>
        </div>` 
    document.querySelector('.cards-wrapper').innerHTML += productCard;

    /*for (i=0; i < item.stars; i++){
        let stars = `<i class="fas fa-star p-1 text-white bg-primary"></i>` 
        document.querySelector('.stars').innerHTML += stars; 
    }*/
}
