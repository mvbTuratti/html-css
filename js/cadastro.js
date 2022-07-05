let query = window.location.search.substring(1);
const path = "http://loja.buiar.com/?key=e257vc";
let cep = document.getElementById("nCEP");
const loc = document.getElementById("nLoc");
const bairro = document.getElementById("nBairro");
const logradouro = document.getElementById("nLogradouro");
const uf = document.getElementById("dUF");
const nome = document.getElementById("nClient");
const numero = document.getElementById("nNum");
const complemento = document.getElementById("nComp");
const cpf = document.getElementById("nCPF");
const codigo = getRandomInt(0,9999);
cep.addEventListener('keydown', (event) => {
    const keyName = event.key;
    const value = cep.value + keyName;

    if (value.length == 8){
        fetch(`https://viacep.com.br/ws/${value}/json`).then(r => r.json()).then(q => {
            loc.value = q.localidade || "";
            bairro.value = q.bairro || "";
            logradouro.value = q.logradouro || "";
            uf.value = q.uf || "";
        })
    }
});

function send() {
    let q = query.split("=")
    let flag = true;
    for (let index = 0; index < q.length - 1; index++) {
        const element = q[index];
        if (element == "json"){
            envioDados(q[index+1].split(";"))
            flag = false;
        }
    }
    if (flag) {alert("Erro com produtos no carrinho! Nenhum Pedido Realizado")}
}

function envioDados(dados) {
    let comp = (complemento != "") ? "&complemento=" + complemento.value : "";
    comp += (numero != "") ? "&numero=" + numero.value : "";
    comp += `&date=${new Date().toLocaleString()}&bairro=${bairro.value}&cep=${cep.value}&cpf=${cpf.value}&uf=${uf.value}&nome=${nome.value}&cidade=${loc.value}&uf=${uf.value}&rua=${logradouro.value}`;
    fetch(`${path}&f=json&c=pedido&t=inserir&codigo=${codigo}${comp}`).then(r => r.json()).then(i => {
        if (i.erro != 0){
            alert("Houve um erro na hora de efetuar o cadastro!")
        } else{
            let id = i.dados.id;
            dados.forEach(element => {
                dado = element.split(",");
                fetch(`${path}&f=json&c=item&t=inserir&id=${getRandomInt(0,9999)}&pedido=${id}&produto=${dado[0]}&qtd=${dado[1]}`)
                .then(ret => ret.json())
                .then(prod => {
                    if (prod.erro != 0){
                        alert(`Erro ao cadastrar o produto de id ${dado[0]}`);
                    }
                });
            });
            window.open(
                `${path}&c=boleto&t=listar&id=${id}`,
                '_blank'
            )
        }
    });
    
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}