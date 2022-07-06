const path = "http://loja.buiar.com/?key=e257vc"
let id

function buscaPedido(){   
    let pedidoId = document.getElementById('idPedido').value 
    //console.log(pedidoId)
    id = pedidoId
    let url = path + "&f=json&c=pedido&t=listar"
    let flag = 0
    let pedido
    console.log(url)
    //busca o pedido
    fetch(url).then(r => r.json()).then(d => {
        for(let i = 0; i<d.dados.length;i++){
            if(d.dados[i].id == pedidoId.toString()){
                pedido = d.dados[i]
                flag = 1
                break
            }
        }
        if(flag){
            //se pedido encontrado, exibe os detalhes do pedido
            let blocoPedido = document.getElementById('blocoPedido')
            blocoPedido.innerHTML=''
            console.log(pedido)
            //add id
            let div = document.createElement('div')
            blocoPedido.appendChild(div)
            let span = document.createElement('span')
            span.innerHTML = '<b>ID do pedido: </b>' + pedido.id
            div.appendChild(span)

            //add nome
            div = document.createElement('div')
            blocoPedido.appendChild(div)
            span = document.createElement('span')
            span.innerHTML = '<b>Nome completo: </b>' + pedido.nome
            div.appendChild(span)
            

            //add cpf
            div = document.createElement('div')
            blocoPedido.appendChild(div)
            span = document.createElement('span')
            span.innerHTML = '<b>CPF: </b>' + pedido.cpf
            div.appendChild(span)
            
            //add cep
            div = document.createElement('div')
            blocoPedido.appendChild(div)
            span = document.createElement('span')
            span.innerHTML = '<b>CEP: </b>' + pedido.cep
            div.appendChild(span)

            //add rua
            div = document.createElement('div')
            blocoPedido.appendChild(div)
            span = document.createElement('span')
            span.innerHTML = '<b>Endereço: </b>' + pedido.rua
            div.appendChild(span)

            //add numero
            div = document.createElement('div')
            blocoPedido.appendChild(div)
            span = document.createElement('span')
            span.innerHTML = '<b>Número: </b>' + pedido.numero
            div.appendChild(span)

            //add complemento
            div = document.createElement('div')
            blocoPedido.appendChild(div)
            span = document.createElement('span')
            span.innerHTML = '<b>Complemento: </b>' + pedido.complemento
            div.appendChild(span)

            //add bairro
            div = document.createElement('div')
            blocoPedido.appendChild(div)
            span = document.createElement('span')
            span.innerHTML = '<b>Bairro: </b>' + pedido.bairro
            div.appendChild(span)

            //add cidade
            div = document.createElement('div')
            blocoPedido.appendChild(div)
            span = document.createElement('span')
            span.innerHTML = '<b>Cidade: </b>' + pedido.cidade
            div.appendChild(span)

            //add uf
            div = document.createElement('div')
            blocoPedido.appendChild(div)
            span = document.createElement('span')
            span.innerHTML = '<b>Estado: </b>' + pedido.uf
            div.appendChild(span)

            //então busca os itens do pedido
            let url2 = path + "&f=json&c=item&t=listar&id="+1+"&pedido="+pedidoId
            fetch(url2).then(r => r.json()).then(d => {
                console.log(d.dados)
                //cria tabela
                let table = document.createElement('table')
                table.setAttribute('id','tabelaDeProdutos')
                blocoPedido.appendChild(table)

                //cria header
                let header = document.createElement('thead')
                let td = document.createElement('td')
                td.innerText = 'ID'
                header.appendChild(td)
            
                td = document.createElement('td')
                td.innerText = 'Produto'
                td.setAttribute('colspan','2')
                header.appendChild(td)

                td = document.createElement('td')
                td.innerText = 'Preço'
                header.appendChild(td)

                td = document.createElement('td')
                td.innerText = 'Quantidade'
                header.appendChild(td)
                table.appendChild(header)
                let url3 = path + "&f=json&c=produto&t=listar"

                //insere produtos
                for(let i = 0; i<d.dados.length;i++){
                    let urlInd = url3 + "&id=" + d.dados[i].produto
                    let quantidade = d.dados[i].qtd
                    fetch(urlInd).then(r => r.json()).then(d => {
                        dado = d.dados[0]
                        //console.log(d.dados)
                        let row = document.createElement('tr')
                        
                        //insere id  
                        let td = document.createElement('td')
                        td.innerText = dado.id
                        row.appendChild(td)
            
                        //insere nome
                        td = document.createElement('td')
                        td.innerText = dado.nome
                        td.setAttribute('colspan','2')
                        row.appendChild(td)
            
                        //insere preco
                        td = document.createElement('td')
                        td.innerText = dado.preco
                        row.appendChild(td)
            
                        //insere quantidade
                        td = document.createElement('td')
                        td.innerText = parseInt(quantidade)
                        row.appendChild(td)
                        table.appendChild(row)
                    })
                }
                let butao = document.createElement('div')
                butao.innerHTML = '<button onclick="gerarBoleto()">Gerar Boleto</button>'
                blocoPedido.appendChild(butao)
            })
        }
        else
            alert('Pedido não encontrado')
    })
}
function gerarBoleto(){
    window.open(
        path + "&c=boleto&t=listar&id=" + id ,
        '_blank')
}