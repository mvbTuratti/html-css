const path = "http://loja.buiar.com/?key=e257vc";
document.getElementById("op").selectedIndex = "0"
getCategorias();
function getCategorias() {
    let url = path + "&f=json&c=categoria&t=listar";
    fetch(url).then(r => r.json()).then(d => constructCards(d.dados));
}

function getProdutos() {
    let urlprod = path + "&f=json&c=produto&t=listar";
    let urlcat = path + "&f=json&c=categoria&t=listar";
    fetch(urlcat).then(resp => resp.json()).then(
        data => {
            const dados = data.dados;
            fetch(urlprod).then(r => r.json()).then(d => {
                constructCards(d.dados, dados);
            })
        }
    );
}

function constructCards(jsonCards, jsonCategories = null) {
    cleanUpCanvas();
    jsonCards = jsonCards || [];
    const catgs = document.getElementsByClassName("categorias")[0];
    while (catgs.firstChild) {
        catgs.removeChild(catgs.lastChild);
    }
    jsonCards.forEach(element => {
        if (jsonCategories){
            createProductCard(jsonCategories, element, catgs);
        } else{
            createCard(element, catgs);
        }
    });
    catgs.style.display = "flex";
}

function changeControl(param) {
    switch (param) {
        case "listar-categorias":
            getCategorias();
            break;
        case "listar-produtos":
            getProdutos();
            break;
        case "criar-categoria":
            createCategory();
            break;
        case "criar-produto":
            createProduct();
            break;
        case "alterar-categoria":
            alterateCategory();
            break;
        case "alterar-produto":
            alterateProduct();
            break;
        case "deletar-categoria":
            deleteCategory();
            break;
        case "deletar-produto":
            deleteProduct();
            break;
        default:
            break;
    }
}


function createCategory() {
    cleanUpCanvas();
    const catgs = document.getElementsByClassName("create")[0];
    
    catgs.style.display = "flex";
}

function cadastroCategoria() {
    const doc = document.getElementById("one");
    fetch(path + "&f=json&c=categoria&t=inserir&nome=" + doc.value)
    .then(resp => resp.json())
    .then(d => {
        if (d.erro === 0){
            alert("Categoria cadastrada com sucesso!");
        } else{
            alert("Erro ao cadastrar");
        }
    });
}
function createProduct() {
    cleanUpCanvas();
    const catgs = document.getElementsByClassName("produto-create")[0];
    let urlcat = path + "&f=json&c=categoria&t=listar";
    fetch(urlcat).then(r => r.json())
    .then(data => {
        const dados = data.dados;
        const selec = document.getElementById("categoriap");
        dados.forEach(e => {
            let div = document.createElement('option');
            div.innerHTML = e.nome;
            div.value = e.id;
            selec.appendChild(div);
        })
    })
    catgs.style.display = "flex";
}
function cadastroProduto() {
    const doc = document.getElementById("one");
    fetch(path + "&f=json&c=categoria&t=listar")
    .then(resp => resp.json())
    .then(d => {
        let categoriaId = 0;
        let str = ""
        document.querySelectorAll('.input-produto').forEach(item =>{
            let size = item.id.length;
            let itemID = item.id.substring(0, size - 1);
            let value = item.value;
            if (itemID === "peso" || itemID === "preco"){
                let msv = value.split(",")[0]
                let msvFormatted = msv.replaceAll(".", "");
                let remainder = value.split(",")[1] || "00"
                value = msvFormatted + "." + remainder;
            }
            str += "&" + itemID + "=" + value;
        })
        fetch(path + "&f=json&c=produto&t=inserir" + str).then(r => r.json()).then(resultado => {
            console.log(resultado)
            if (resultado.erro === 0){
                alert("Produto cadastrado com sucesso!");
            } else{
                alert("Erro ao cadastrar");
            }
        })
    });
}

function alterateCategory() {
    cleanUpCanvas();
    const catgs = document.getElementsByClassName("categoria-altera")[0];
    fetch(path + "&f=json&c=categoria&t=listar")
    .then(resp => resp.json())
    .then(d => {
        const dados = d.dados;
        const selec = document.getElementById("a-categoria");
        dados.forEach(e => {
            let div = document.createElement('option');
            div.innerHTML = e.nome;
            div.value = e.id;
            selec.appendChild(div);
        })     
    })
    catgs.style.display = "flex";
}
function alterarCategoria() {
    const id = document.getElementById("a-categoria").value;
    const nome = document.getElementById("a-i-categoria").value;
    fetch(path + "&f=json&c=categoria&t=alterar&id=" + id + "&nome=" + nome)
    .then(r => r.json())
    .then( d => {
        if (d.erro === 0){
            alert("Categoria alterada com sucesso!");
        } else{
            alert("Erro ao alterar");
        }
        document.getElementById("op").selectedIndex = "0";
        changeControl("listar-categorias");
    })
}

function alterateProduct() {
    cleanUpCanvas();
    const catgs = document.getElementsByClassName("produto-altera")[0];
    const produtoSelect = document.getElementById("idpp");
    const categoriaSelect = document.getElementById("categoriapp");
    fetch(path + "&f=json&c=categoria&t=listar")
    .then(resp => resp.json())
    .then(d => {
        const dados = d.dados;
        let div = document.createElement('option');
        div.innerHTML = "Manter o mesmo";
        div.value = "nil";
        div.selected = true;
        categoriaSelect.appendChild(div)
        dados.forEach(e => {
            let div = document.createElement('option');
            div.innerHTML = e.nome;
            div.value = e.id;
            categoriaSelect.appendChild(div);
        })
        fetch(path + "&f=json&c=produto&t=listar")
        .then(r => r.json())
        .then(data => {
            const dado = data.dados;
            dado.forEach(e => {
                let div = document.createElement('option');
                div.innerHTML = e.nome;
                div.value = e.id;
                produtoSelect.appendChild(div);
            })
        })
    })
    catgs.style.display = "flex";
}
function alterarProduto() {
    let str = ""
    document.querySelectorAll('.i-a-produto').forEach(item =>{

        let size = item.id.length;
        
        if (item.value != "nil" && item.value != ""){
            let itemID = item.id.substring(0, size - 2);
            let value = item.value;
            if (itemID === "peso" || itemID === "preco"){
                let msv = value.split(",")[0]
                let msvFormatted = msv.replaceAll(".", "");
                let remainder = value.split(",")[1] || "00"
                value = msvFormatted + "." + remainder;
            }
            str += "&" + itemID + "=" + value;
        }
    })
    console.log(path + "&f=json&c=produto&t=alterar" + str)
    fetch(path + "&f=json&c=produto&t=alterar" + str)
    .then(r => r.json())
    .then( d => {
        if (d.erro === 0){
            alert("Produto alterado com sucesso!");
        } else{
            alert("Erro ao alterar");
        }
        document.getElementById("op").selectedIndex = "1";
        changeControl("listar-produtos");
    })
    
}
function deleteCategory() {
    cleanUpCanvas();
    const catgs = document.getElementsByClassName("categoria-remove")[0];
    const selec = document.getElementById("d-categoria");
    fetch(path + "&f=json&c=produto&t=listar")
    .then(resp => resp.json())
    .then(d => {
        let prods = new Set();
        d.dados.forEach(e => prods.add(e.categoria));
        fetch(path + "&f=json&c=categoria&t=listar").then(r => r.json()).then(ans => {
            ans.dados.forEach(e => {
                if (!prods.has(e.id)){
                    let div = document.createElement('option');
                    div.innerHTML = e.nome;
                    div.value = e.id;
                    selec.appendChild(div);    
                }
            })
        })
    });
    catgs.style.display = "flex";
}
function deletarCategoria() {
    const product = document.getElementById("d-categoria");
    fetch(path + "&f=json&c=categoria&t=remover&id=" + product.value)
    .then(j => j.json())
    .then(d => {
        if (d.erro === 0){
            alert("Categoria removida com sucesso!");
        } else{
            alert("Erro ao remover");
        }
        document.getElementById("op").selectedIndex = "0";
        changeControl("listar-categorias");
    })
}
function deleteProduct() {
    cleanUpCanvas();
    const catgs = document.getElementsByClassName("produto-remove")[0];
    const selec = document.getElementById("d-produto");
    fetch(path + "&f=json&c=produto&t=listar")
    .then(resp => resp.json())
    .then(d => {
        d.dados.forEach(e => {
            let div = document.createElement('option');
            div.innerHTML = e.nome;
            div.value = e.id;
            selec.appendChild(div);
        })
    });
    catgs.style.display = "flex";
}
function deletarProduto() {
    const product = document.getElementById("d-produto");
    fetch(path + "&f=json&c=produto&t=remover&id=" + product.value)
    .then(j => j.json())
    .then(d => {
        if (d.erro === 0){
            alert("Produto removido com sucesso!");
        } else{
            alert("Erro ao remover");
        }
        document.getElementById("op").selectedIndex = "1";
        changeControl("listar-produtos");
    })
}
function createCard(element, catgs) {
    let card = document.createElement('div');
    card.classList.add("cards");
    let id = document.createElement('div');
    id.classList.add("id");
    id.innerHTML = `<b>${element.id}</b>`
    card.appendChild(id);
    let nome = document.createElement('div');
    nome.classList.add("nome");
    nome.innerHTML = `${element.nome}`
    card.appendChild(nome);
    catgs.appendChild(card);
}

function createProductCard(categorias, elemento, div){
    let divs = []
    let card = document.createElement('div');
    card.classList.add("cards");
    let id = document.createElement('div');
    id.classList.add("id");
    id.innerHTML = `<b>${elemento.id}</b>`
    divs.push(id);
    let dimg = document.createElement('div');
    dimg.classList.add("images");
    let img = new Image(50,50);
    img.src = elemento.imagem;
    img.alt = `Imagem do produto: ${elemento.nome}`;
    dimg.appendChild(img);
    divs.push(dimg);
    let nome = document.createElement('div');
    nome.classList.add("products");
    nome.innerHTML = `${elemento.nome}`
    divs.push(nome);
    categorias.forEach(c => {
        if (c.id === elemento.categoria){
            let cat = document.createElement('div');
            cat.classList.add("products");
            cat.innerHTML = `Categoria - ${c.nome}`
            divs.push(cat);
            
        }
    })
    let preco = document.createElement('div');
    preco.classList.add("products");
    let money = parseFloat(elemento.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })
    preco.innerHTML = `Preço - ${money}`;
    divs.push(preco);
    let peso = document.createElement('div');
    peso.classList.add("products");
    peso.innerHTML = `Peso - ${elemento.peso}kg`
    divs.push(peso);
    divs.forEach(d => card.appendChild(d));
    div.appendChild(card);
}


function cleanUpCanvas() {
    const catgs = document.getElementsByClassName("body-results")[0]
    const children = catgs.children;
    for (let index = 0; index < children.length; index++) {
        const element = children[index];
        element.style.display = "none";
    }

    document.querySelectorAll("select").forEach(e => {
        if (e.id !== "op"){
            let i, L = e.options.length - 1;
            for(i = L; i >= 0; i--) {
                e.remove(i);
            }
        }
    })
}
