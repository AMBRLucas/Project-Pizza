// Carrinho
let cart = []

// Variavel de Quantidade do Modal
let modalQt = 1;

// Identificação de qual pizza está aberta no modal
let modalKey = 0;

// Criação de funções auxiliares
const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// Listagem das Pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    // Adicionando o index da pizza no item para identificação da pizza clicada
    pizzaItem.setAttribute('data-key', index);
    
    // Preenchendo as Informações nos cards de cada pizza
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;

    // Adicionando o evento de click para abertura do modal da pizza escolhida
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        modalQt = 1;

        // Verificando e armazenando o valor do index da pizza escolhida
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalKey = key;

        // Preenchendo as Informações da pizza escolhida no modal 
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML =  `R$ ${pizzaJson[key].price.toFixed(2)}`;
        
        // Removendo a seleção de tamanho do modal para sempre que for aberto marcar a opção grande
        c('.pizzaInfo--size.selected').classList.remove('selected')
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex == 2){
                size.classList.add('selected')
            };
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        // Aparecendo o modal na tela
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';

        // Intervalo para animação de opacidade CSS
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    // Fazendo os cards aparecerem na tela
    c('.pizza-area').append(pizzaItem);
});

// Eventos do Modal

// Evento para fechar o modal
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500)
};

// Adicionando o evento de fechar o modal aos botões
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

// Botões de aumentar a e diminuir a quantidade de pizzas
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

// Seleção de tamanho
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    });
});

// Evento de adição de pizza ao carrinho

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))

    // Gerando um identificador usando o Id e o Tamanho da pizza para evitar criação de dois itens de pizzas iguais
    let identifier = `${pizzaJson[modalKey].id}@${size}`;

    // Verificando se o Identificador ja existe no carrinho
    let key = cart.findIndex((item)=>item.identifier == identifier);

    if(key > -1){
        // Se ja houver o mesmo identificador no carrinho, apenas somar a quantidade
        cart[key].qt += modalQt
    }else{
        // Se não houver, cria um novo item
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        })
    }
    
    // Atualiza o carrinho e fecha o modal
    updateCart()
    closeModal()
});

// Abre o Carrinho na versão mobile
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = 0;
    }
});

// Fecha o carrinho na verão mobile
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = "100vw"
})

// Função que abre, fecha e atualiza o carrinho de compras
function updateCart(){
    // Atualiza o numero de itens no menu do carrinho Mobile
    c('.menu-openner span').innerHTML = cart.length;
    
    // Condição de exibição do carrinho
    if(cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        // Valores
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        // Loop para exibição de cada um dos itens do carrinho
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt; 

            let cartItem = c('.models .cart--item').cloneNode(true);
            
            // Switch para exibição do tamanho escolhido no nome da pizza
            let pizzaSizeName;
            switch(cart[i].size){
                case 0: 
                    pizzaSizeName = "P"
                    break;
                case 1: 
                    pizzaSizeName = "M"
                    break;
                case 2: 
                    pizzaSizeName = "G"
                    break            
            }

            // Preenchendo os itens do carrinho
            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome'). innerHTML = `${pizzaItem.name} (${pizzaSizeName})`;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            // Modificador de quantidade no carrinho 
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){
                    // Se houver mais de uma pizza, diminui a quantidade
                    cart[i].qt--
                }else{
                    // Se houver apenas uma pizza, remove ela do carrinho
                    cart.splice(i, 1);
                }
                updateCart()
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                // Soma um na quantidade de pizza
                cart[i].qt++
                updateCart()
            });

            // Adiciona visualmente as pizza do carrinho na tela
            c('.cart').append(cartItem);

            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            // exibição dos valores do carrinho
            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
        }
    }else{
        // Remove o carrinho da tela caso não tenha nenhum item nele
        c('aside').classList.remove('show')
        c('aside').style.left = "100vw"
    }
}