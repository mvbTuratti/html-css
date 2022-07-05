const path = "http://loja.buiar.com/?key=e257vc";
let countCar = 0
let shoppingCart = []
let valor = []
let dado
function getCategorias(){
    
    let url = path + "&f=json&c=categoria&t=listar"
    fetch(url).then(r => r.json()).then(d => {
        let selector = document.getElementById('categoriaSelector')
        for(let i = 0; i< d.dados.length; i++){
            let option = document.createElement('option')
            option.innerText = d.dados[i].nome
            option.setAttribute('value', d.dados[i].id.toString())
            selector.appendChild(option)
            }
        getProdutos()
    });
}
function getProdutos(categoria = null){
    let botosFinais = document.getElementById("botoesFinalDeCompra")
    botosFinais.style.visibility="hidden"

    let url = path + "&f=json&c=produto&t=listar"
    if(categoria)
        url += "&categoria=" + categoria
    fetch(url).then(r => r.json()).then(d => {
        let table = document.getElementById('tabelaDeProdutos')
        table.innerHTML=''
        //cria header
        let header = document.createElement('thead')
        let td = document.createElement('td')
        td.innerText = 'ID'
        header.appendChild(td)

        td = document.createElement('td')
        td.innerText = 'Produto'
        header.appendChild(td)
        
        td = document.createElement('td')
        td.innerText = 'Nome'
        td.setAttribute('colspan','2')
        header.appendChild(td)

        td = document.createElement('td')
        td.innerText = 'Preço'
        header.appendChild(td)

        td = document.createElement('td')
        td.innerText = 'Descrição'
        td.setAttribute('colspan','2')
        header.appendChild(td)

        table.appendChild(header)
        for(let i=0;i<d.dados.length;i++){
            let row = document.createElement('tr')
            let td = document.createElement('td')
            //insere id   
            td.innerText = d.dados[i].id
            row.appendChild(td)

            //insere imagem
            td = document.createElement('td')
            let urlImg = d.dados[i].imagem
            td.innerHTML = '<img src="' + urlImg + '"ondblclick="addCart(this.id)" alt="" height="120px" draggable="true" ondragstart="getId(event)" id='+d.dados[i].id.toString()+ '></img>'
            row.appendChild(td)

            //insere nome
            td = document.createElement('td')
            td.innerText = d.dados[i].nome
            td.setAttribute('colspan','2')
            row.appendChild(td)

            //insere preco
            td = document.createElement('td')
            td.innerText = "R$ " + d.dados[i].preco
            row.appendChild(td)

            //insere descrição
            td = document.createElement('td')
            td.innerText = d.dados[i].descricao
            td.setAttribute('colspan','2')
            row.appendChild(td)

            table.appendChild(row)
        }
    })
}
function getId(ev){
    ev.dataTransfer.setData("text",ev.target.id)
    //console.log(ev.target.id)
}
function allowDrop(ev){
    ev.preventDefault()
}

function dropado(ev){
    ev.preventDefault()
    var data = ev.dataTransfer.getData("text")
    contagemCarrinho = document.getElementById('countCart')
    countCar++
    contagemCarrinho.innerText = countCar.toString()
    shoppingCart.push(data)
}

function addCart(ev){
    contagemCarrinho = document.getElementById('countCart')
    countCar++
    contagemCarrinho.innerText = countCar.toString()
    shoppingCart.push(ev)
}

function abreCarrinho(){
    valor = []
    let table = document.getElementById('tabelaDeProdutos')
    table.innerHTML=''
    //cria header
    let header = document.createElement('thead')
    let td = document.createElement('td')
    td.innerText = 'ID'
    header.appendChild(td)

    td = document.createElement('td')
    td.innerText = 'Nome'
    header.appendChild(td)

    td = document.createElement('td')
    td.innerText = 'Preço Uni'
    header.appendChild(td)

    td = document.createElement('td')
    td.innerText = 'Quantidade'
    header.appendChild(td)
    table.appendChild(header)

    let counts = {};
    shoppingCart.forEach((x) => {
        counts[x] = (counts[x] || 0) + 1;
    })
    counts = Object.entries(counts)
    //console.log(counts.length)
    let url = path + "&f=json&c=produto&t=listar"
    
    for(let i = 0;i<counts.length;i++){
        let urlInd = url + "&id=" + counts[i][0]
        var alpha
        console.log(urlInd)
        fetch(urlInd).then(r => r.json()).then(d => {
            dado = d.dados[0]
            let row = document.createElement('tr')
            let rowsetID = 'row' + dado.id
            row.setAttribute('id',rowsetID)
            
            //insere id  
            let td = document.createElement('td')
            td.innerText = dado.id
            let datasetID = 'id' + dado.id
            td.setAttribute('id',datasetID)
            row.appendChild(td)

            //insere nome
            td = document.createElement('td')
            td.innerText = dado.nome
            row.appendChild(td)

            //insere preco
            td = document.createElement('td')
            td.innerText = dado.preco
            row.appendChild(td)
            alpha = [dado.preco,counts[i][1],dado.id]

            //insere quantidade
            td = document.createElement('td')
            td.innerText = counts[i][1]
            let quantSetID = 'quan'+dado.id
            td.setAttribute('id',quantSetID)
            row.appendChild(td)

            //insere botão add
            td = document.createElement('td')
            td.innerHTML = '<button onclick="changeQuantidade('+dado.id+',0)">+</button>'
            row.appendChild(td)

            //insere botão sub
            td = document.createElement('td')
            td.innerHTML = '<button onclick="changeQuantidade('+dado.id+',1)">-</button>'
            row.appendChild(td)

            //insere botão limpa
            td = document.createElement('td')
            td.innerHTML = '<button onclick="changeQuantidade('+dado.id+',2)">limpar</button>'
            row.appendChild(td)
            table.appendChild(row)
            valor.push(alpha)
            let botosFinais = document.getElementById("botoesFinalDeCompra")
            botosFinais.style.visibility="visible"
            botosFinais = document.getElementById("totalDaCompraDinheiros")
            botosFinais.innerText = calculaTotal()
            })
            
            
    }
       
}

function calculaTotal(){
    let acum = 0
    console.log(valor)
    for(let i=0;i<valor.length;i++){
        acum += parseInt(valor[i][0])*valor[i][1]
        console.log(valor[i][0])
    }
    return acum
}

function changeQuantidade(id,operation){
    //adição
    if(operation==0){
        let quantidade = "quan"+id
        let dado = document.getElementById(quantidade)   
        dado.innerHTML = parseInt(dado.innerHTML)+1

        let contagemCarrinho = document.getElementById('countCart')
        countCar++
        contagemCarrinho.innerText = countCar.toString()
        for(let i=0;i<valor.length;i++){
            if(valor[i][2]==id)
                valor[i][1]++
        }
    }
    if(operation==1){
        let quantidade = "quan"+id
        let dado = document.getElementById(quantidade)
        let quantia = parseInt(dado.innerHTML)-1
        if(quantia){
            dado.innerHTML = quantia
            let contagemCarrinho = document.getElementById('countCart')
            countCar--
            contagemCarrinho.innerText = countCar.toString()
            for(let i=0;i<valor.length;i++){
                if(valor[i][2]==id)
                    valor[i][1]--
        }
        }
        else{
            limpaLinha(id)
        }
    }
    if(operation==2){
        limpaLinha(id)
    }
    let botosFinais = document.getElementById("totalDaCompraDinheiros")
    botosFinais.innerText = calculaTotal()
}

function limpaLinha(id){
    //tira filho
    let rowId = 'row'+id
    //idTested = id
    let row = document.getElementById(rowId)
    let table = document.getElementById('tabelaDeProdutos')
    table.removeChild(row)
    //console.log(valor)
    //tira do shoppingCart
    for(let i=0;i<valor.length;i++){

        if(valor[i][2]==id.toString()){
            let contagemCarrinho = document.getElementById('countCart')
            countCar-=valor[i][1]
            contagemCarrinho.innerText = countCar.toString()
            valor.splice(i,1)
            break
        }
    }
}

function finalizaCompra(){
    //window.location.href = 'https://google.com';
    if(valor.length==0)
        alert('Carrinho Vazio')
    else{
        let urlCompra = "cadastro.html?json="
        for(let i=0;i<valor.length;i++){
            urlCompra += valor[i][2]+','+valor[i][1]+';'
        }
        
        console.log(urlCompra)
        //limpa o carrinho
        valor = []
        shoppingCart = []
        countCar = 0
        window.location.href = urlCompra.slice(0, -1)
    }
    
}