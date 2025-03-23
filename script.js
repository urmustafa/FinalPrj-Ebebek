$(document).ready(function() {
    //console.log("CSS ekleniyor...");
    

    function checkIfHomepage() {
        if (window.location.pathname !== "/") {
            console.log("wrong page");
            return false;
        }
        return true;
    }

    if (!checkIfHomepage()) return;


    function addCSS() {
        const style = document.createElement('style');
        style.innerHTML = `
            .carousel-container {
                width: 100%;
                margin: 20px 0;
                text-align: center;
                font-family: Arial, sans-serif;
            }
            .carousel-inner {
                display: flex;
                overflow: hidden;
                scroll-behavior: smooth;
                gap: 10px;
            }

            .product-card {
                position: relative;
                flex: 0 0 16.6%;
                text-align: center;
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 10px;
                transition: transform 0.3s ease;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }

            .product-card:hover {
                transform: scale(1.05);
            }

            .product-card a {
                text-decoration: none;
                color: #0038AE;
                min-height: 300px;
            }

            .product-card img {
                width: 100%;
                height: auto;
                border-radius: 10px;
            }

            .heart-icon {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 24px;
                color: #ccc;
                cursor: pointer;
            }

            .heart-icon.filled {
                color: #1e90ff;
            }

            .carousel-navigation {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
            }

            .prev-button, .next-button {
                background-color: #f0f0f0;
                border: none;
                padding: 10px;
                font-size: 16px;
                cursor: pointer;
            }

            .add-to-cart-button {
                background-color: #f0f0f0;
                border: none;
                padding: 10px;
                font-size: 16px;
                cursor: pointer;
                margin-top: 10px;
                color: #0038AE;
            }

            @media (max-width: 1024px) {
                .product-card {
                    flex: 0 0 32%;
                }
            }

            @media (max-width: 768px) {
                .product-card {
                    flex: 0 0 48%;
                }
            }

            @media (max-width: 480px) {
                .product-card {
                    flex: 0 0 100%;
                }

                .carousel-inner {
                    gap: 5px;
                }

                .prev-button, .next-button {
                    padding: 12px;
                    font-size: 18px;
                }
            }

            @media (min-width: 1440px) {
                .product-card {
                    flex: 0 0 14%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addCSS();


    function getFavoriteProducts() {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        //console.log("Favori ürünler alınıyor...", favorites);
        return favorites;
    }

    function getCartProducts() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart;
    }

    function updateFavoriteStatus(productId, isFavorite) {
        const favorites = getFavoriteProducts();
        //console.log("Favoriler güncelleniyor:", favorites, "Ürün ID:", productId, "Durum:", isFavorite);
        if (isFavorite) {
            if (!favorites.includes(productId)) {
                favorites.push(productId);
                console.log("Favori ürün ekleniyor:", productId);
            }
        } else {
            const index = favorites.indexOf(productId);
            if (index > -1) {
                favorites.splice(index, 1);
                console.log("Favori ürün çıkarılıyor:", productId);
            }
        }
        console.log("Yeni favoriler:", favorites);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function updateCartStatus(productId) {
        const cart = getCartProducts();
        if (!cart.includes(productId)) {
            cart.push(productId);
            console.log("Ürün sepete ekleniyor:", productId);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function fetchProducts() {
        const products = JSON.parse(localStorage.getItem('products'));
        console.log("Ürünler alınıyor...");
        if (products != null) {
            // console.log("LocalStorage'dan ürünler alındı.");
            return Promise.resolve(products);
        } else {
            return $.get('https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json')
                .then(data => {
                    console.log("Ürünler API'den alındı.");
                    localStorage.setItem('products', JSON.stringify(data));
                    return data;
                })
                .catch(error => {
                    console.error('API hatası:', error);
                    return [];
                });
        }
    }

    function createCarousel(products) {
        if (!Array.isArray(products)) {
            return;
        }
        console.log("Ürünler alındı ve karusel oluşturuluyor...");
        const $carouselContainer = $('<div class="carousel-container"></div>');
        const $title = $('<h2>Beğenebileceğinizi düşündüklerimiz</h2>');
        $carouselContainer.append($title);
        const $carouselInner = $('<div class="carousel-inner"></div>');

        products.slice(0, products.length).forEach(product => {
            console.log("Ürün kartı oluşturuluyor:", product);
            const $productCard = $(`
                <div class="product-card">
                    <a href="${product.url}" target="_blank">
                        <img src="${product.img}" alt="${product.name}">
                        <h3>${product.name}</h3>
                    </a>
                    <div class="card-footer">
                        ${displayPrice(product)}
                        <button class="favorite-button" data-product-id="${product.id}">
                            <svg class="heart-icon ${isFavorite(product.id) ? 'filled' : ''}" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/>
                            </svg>
                        </button>
                        <button class="add-to-cart-button" data-product-id="${product.id}">Sepete Ekle</button>
                    </div>
                </div>
            `);
            $carouselInner.append($productCard);
        });

        const $carouselNavigation = $('<div class="carousel-navigation"></div>');
        const $prevButtonNav = $('<button class="prev-button">←</button>');
        const $nextButtonNav = $('<button class="next-button">→</button>');
        $carouselNavigation.append($prevButtonNav, $nextButtonNav);

        $carouselContainer.append($carouselInner, $carouselNavigation);

        const $carousel = $('.carousel-inner');
        $prevButtonNav.on('click', function() {
            $carousel.animate({ scrollLeft: '-=300px' }, 300);
        });

        $nextButtonNav.on('click', function() {
            $carousel.animate({ scrollLeft: '+=300px' }, 300);
        });

        $('.Section2A.has-components').before($carouselContainer);
    }

    function displayPrice(product) {
        let priceHtml = `<p>${product.price}₺</p>`;
        if (product.price !== product.original_price) {
            const discount = product.original_price - product.price;
            priceHtml += `<p><strike>${product.original_price}₺</strike> ${discount}₺ İndirim</p>`;
        }
        return priceHtml;
    }

    function isFavorite(productId) {
        const favorites = getFavoriteProducts();
        console.log("Favori kontrol ediliyor:", productId);
        return favorites.includes(productId);
    }

    $(document).on('click', '.favorite-button', function() {
        const productId = $(this).data('product-id');
        console.log("Favori butonuna tıklanıyor:", productId);
        toggleFavoriteButton(productId);
    });

    $(document).on('click', '.add-to-cart-button', function() {
        const productId = $(this).data('product-id');
        console.log("Sepete ekleme butonuna tıklanıyor:", productId);
        updateCartStatus(productId);
    });

    function toggleFavoriteButton(productId) {
        const $button = $(`[data-product-id="${productId}"]`);
        const isFavorite = $button.find('.heart-icon').hasClass('filled');
        $button.find('.heart-icon').toggleClass('filled', !isFavorite);
        updateFavoriteStatus(productId, !isFavorite);
    }

    fetchProducts().then(products => {
        if (products.length > 0) {
            createCarousel(products);
        } else {
            console.error('Ürün verisi alınamadı!');
        }
    });
});
