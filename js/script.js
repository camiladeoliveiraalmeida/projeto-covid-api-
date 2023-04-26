var dadosPizza = [
    ["categorias", "quantidades"],
    ["0", 0]

]


google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(desenharGrafico);

function desenharGrafico() {

    var data = google.visualization.arrayToDataTable(dadosPizza);

    var options = {
        title: 'Casos de COVID-19 no mundo'
    };

    var chart = new google.visualization.PieChart(document.getElementById('grafico-pizza'));

    chart.draw(data, options);

}

async function carregarDados() {
    await fetch('https://covid19-brazil-api.vercel.app/api/report/v1/countries')
        .then(Response => Response.json())
        .then(dados => preparaDados(dados))
        .catch(e => exibirDados(e.mansagem));
}

function preparaDados(dados) {
    var casos = 0
    var recuperados = 0
    var mortos = 0

    for (let i = 0; i < dados['data'].length; i++) {
        casos = casos + dados['data'][i].confirmed
        recuperados = recuperados + dados['data'][i].recovered
        mortos = mortos + dados['data'][i].deaths
    }

    dadosPizza = [
        ['categoria', 'total']

    ];

    dadosPizza.push(['Confirmados', casos]);
    dadosPizza.push(['Recuperados', recuperados]);
    dadosPizza.push(['Mortes', mortos]);

    desenharGrafico();
}

// tabela//
// Função para ler a API e obter os dados de moedas

async function carregarDados2() {
    // ocultar a div de erro (se estiver visível)

    await fetch('https://covid19-brazil-api.vercel.app/api/report/v1')   //Endpoint da API
        .then(response => response.json())    // Obtendo resposta da API
        .then(dados => prepararDados2(dados))  // Obtendo os dados
        .catch(e => exibirErro(e.message));   // Obtendo erro (se der erro)
}


// Função para preparar e exibir os dados no HTML
function prepararDados2(dados) {
    // Criando variável para controlar as linhas da tbody
    let linhas = document.getElementById('linhas');
    linhas.innerHTML = '';

    // Laço para percorrer todos os dados recebidos
    for (let i = 0; i < dados['data'].length; i++) {

        let auxLinha = '';
        auxLinha = '<tr>';

        auxLinha += '<td>' + dados['data'][i].uf + '</td>' +
            '<td>' + dados['data'][i].state + '</td>' +
            '<td>' + dados['data'][i].cases + '</td>' +
            '<td>' + dados['data'][i].deaths + '</td>' +
            '<td>' + dados['data'][i].suspects + '</td>' +
            '<td>' + dados['data'][i].refuses + '</td>' +
            '</tr>';

        linhas.innerHTML += auxLinha;
    }
}

//////MAPA///////
var dados_mapa = [
    ['País', 'Casos'],
    ['0', 0]
];

google.charts.load('current', {
    'packages': ['geochart'],
});
google.charts.setOnLoadCallback(fazermapa);

function fazermapa() {
    var data = google.visualization.arrayToDataTable(
        dados_mapa
    );

    let options = {
        colorAxis: { colors: ['red', 'pink'] }
    }

    var chart = new google.visualization.GeoChart(document.getElementById('mapa'));

    chart.draw(data, options);
}

async function carregarMapa() {
    await fetch('https://covid19-brazil-api.vercel.app/api/report/v1/countries')
        .then(response => response.json())
        .then(dados => prepararDadosMapa(dados))


}


function prepararDadosMapa(dados) {

    dados_mapa = [
        ['País', 'Casos']
    ];

    for (let i = 0; i < dados['data'].length; i++) {
        dados_mapa.push([dados['data'][i].country, dados['data'][i].confirmed])
    }

    console.table(dados_mapa)

    fazermapa();

}

//tirar botão//
document.addEventListener("DOMContentLoaded",
    function (event) {
        carregarMapa();
        carregarDados();
        carregarDados2();
    }
);