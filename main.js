// Метод fetch
const API_URL = "https://fakestoreapi.com"

let products = []

class API {
    addProductToCart(productId) {
        const body = JSON.stringify({
            userId: 3,
            date: "2022-02-05",
            products: [{ productId, quantity: 1 }]
        })

        return fetch(`${API_URL}/carts/7`, {
            method: "POST",
            body
        })
    }

    fetchAllProducts(params = {}) {
        const queryParams = new URLSearchParams(params)

        return fetch(`${API_URL}/products?${queryParams.toString()}`)
    }
}

const api = new API()

const CreateCard = (product) => {
    return `<div class="products__item">
    <img src="${product.image}" />
    <p>${product.title}</p>
    <p>${product.price}</p>
    <button class="products__addBtn" data-product-id="${product.id}">Заказать</button>
</div>`
}

function CreateBasket() {
    let cart = document.createElement('div'),
        field = document.createElement('div'),
        heading = document.createElement('h2'),
        closeBtn = document.createElement('button');

    cart.classList.add('cart')
    field.classList.add('cart-field')
    closeBtn.classList.add('close')

    heading.textContent = "В нашей корзине:";
    closeBtn.textContent = "Закрыть";

    document.body.appendChild(cart);
    cart.appendChild(heading);
    cart.appendChild(field);
    cart.appendChild(closeBtn);
}

window.addEventListener("load", function () {
    let productsList = document.querySelector(".products")
    let openBtn = document.querySelector('.open')
    let buttons = document.querySelectorAll('.products__addBtn')
    let products = document.querySelectorAll('.products__item')

    CreateBasket()

    let field = document.querySelector('.cart-field'),
        cart = document.querySelector('.cart'),
        close = document.querySelector('.close');

    function openCart() {
        cart.style.display = 'block';
    }

    function closeCart() {
        cart.style.display = 'none';
    }

    openBtn.addEventListener('click', openCart);
    close.addEventListener('click', closeCart);

    // for(let i=0; i<buttons.length; i++) {
    //     buttons[i].addEventListener('click', function() {
    //         let item = products[i].cloneNode(true),
    //             btn = item.querySelector('.products__addBtn');

    //         btn.remove();
    //         field.appendChild(item);
    //         products[i].remove();
    //     });

        buttons.forEach((item, i) => {
            item.addEventListener('click', () => {
                let item = products[i].cloneNode(true),
                    btn = item.querySelector('.products__addBtn');
    
                btn.remove();
                field.appendChild(item);
                products[i].remove();
            });
    
        });


    api.fetchAllProducts({ limit: 10 })
        .then((res) => res.json())
        .then((res) => {
            products = res
            productsList.innerHTML += res.map(CreateCard).join("")
        })
        .catch((err) => {
            console.log(err);
            alert("Возникла ошибка при отправке запроса")
        })

    productsList.addEventListener("click", function (event) {
        if (event.target.tagName == "BUTTON") {
            event.target.disabled = true
            const productId = +event.target.getAttribute("data-product-id")
            api.addProductToCart(productId)
                .then((res) => {
                    console.log(products, productId)
                    const product = products.find(product => product.id === productId)
                    console.log(product)
                    console.log(res)
                    event.target.textContent = "Добавлено"
                    field.innerHTML += `
                       <div class="products__item">
                        <img src="${product.image}" />
                        <p>${product.title}</p>
                        <p>${product.price}</p>
                       </div> 
                    `
                })
                .catch(() => {
                    event.target.disabled = false
                })
        }
    })
})


