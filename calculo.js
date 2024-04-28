document.addEventListener('DOMContentLoaded', function() {
    $('#valordoFrete').mask("###.##,00");
    $('#margem').mask('###,##', {reverse: true});

    const valordoFrete = document.getElementById('valordoFrete');
    const margem = document.getElementById('margem');
    const estadoOrigem = document.getElementById('estadoSaida');
    const estadoDestino = document.getElementById('estadoDestino');
    const freteParaPJField = document.getElementById('freteParaPJ');
    const freteParaPFField = document.getElementById('freteParaPF');
    const calcular = document.getElementById('calcular');
    const limpar = document.getElementById('limpar');

    // Tabela ICMS
    const icmsTaxas = {
        SC: { MT: 7, PR: 12, SC: 0, MS: 7, GO: 7, MG: 12, SP: 12, RS: 12 },
        PR: { MT: 7, PR: 0, SC: 12, MS: 7, GO: 7, MG: 12, SP: 12, RS: 12 },
        MT: { MT: 0, PR: 12, SC: 12, MS: 12, GO: 12, MG: 12, SP: 12, RS: 12}
    }

    // Obtendo taxas de ICMS
    function obterTaxaICMS(estadoOrigem, estadoDestino) {
        return icmsTaxas[estadoOrigem][estadoDestino]
    }

    // Frete (PJ) 
    function calcularFreteParaPJ(valorFrete, margem, taxaICMS) {
        const totalPorcentagem = margem + taxaICMS
        const descontoTotal = valorFrete * (totalPorcentagem / 100)
        return valorFrete - descontoTotal
    }

    // Frete (PF) 
    function calcularFreteParaPF(valorFrete, margem, taxaICMS) {
        const totalPorcentagem = margem + taxaICMS + 3.25 
        const descontoTotal = valorFrete * (totalPorcentagem / 100)
        return valorFrete - descontoTotal
    }

    // Adicionando um evento de clique ao botão de calcular
    calcular.addEventListener('click', function() {
        // Remova pontos e vírgulas do valor antes de converter para número
        const valorFrete = parseFloat(valordoFrete.value.replace(/\./g, '').replace(',', '.'));

        const margemValor = parseFloat(margem.value);
        const estadoOrigemValor = estadoOrigem.value;
        const estadoDestinoValor = estadoDestino.value;     

        // Tratamentos
        if (isNaN(valorFrete) || isNaN(margemValor) || estadoOrigemValor === '' || estadoDestinoValor === '') {
            alert('Por favor, preencha todos os campos corretamente.')
            return
        }        
        
        if (!icmsTaxas.hasOwnProperty(estadoOrigemValor) || !icmsTaxas[estadoOrigemValor].hasOwnProperty(estadoDestinoValor)) {
            alert('Taxa de ICMS não encontrada para a combinação de estados selecionados.')
            return
        }

        const taxaICMS = obterTaxaICMS(estadoOrigemValor, estadoDestinoValor);

        const freteParaPJ = calcularFreteParaPJ(valorFrete, margemValor, taxaICMS);
        const freteParaPF = calcularFreteParaPF(valorFrete, margemValor, taxaICMS);

        // Resultados
        freteParaPJField.value = freteParaPJ.toFixed(2);
        freteParaPFField.value = freteParaPF.toFixed(2);
    });

    // Limpar
    limpar.addEventListener('click', function() {
        valordoFrete.value = ''      
        estadoOrigem.value = ''
        estadoDestino.value = ''
        freteParaPJField.value = ''
        freteParaPFField.value = ''
    });
});
