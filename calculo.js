document.addEventListener('DOMContentLoaded', function() {
    function formatNumber(number) {
        return number.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function parseFormattedNumber(str) {
        return parseFloat(str.replace(/\./g, '').replace(',', '.'));
    }

    $('#valordoFrete').on('input', function(e) {
        var value = e.target.value.replace(/\D/g, '');
        value = (parseInt(value) / 100).toFixed(2);
        e.target.value = formatNumber(parseFloat(value));
    });

    $('#margem').on('input', function(e) {
        var value = e.target.value.replace(/\D/g, '');
        value = (parseInt(value) / 100).toFixed(2);
        e.target.value = value;
    });

    const valordoFrete = document.getElementById('valordoFrete');
    const margem = document.getElementById('margem');
    const estadoOrigem = document.getElementById('estadoSaida');
    const estadoDestino = document.getElementById('estadoDestino');
    const freteParaPJField = document.getElementById('freteParaPJ');
    const freteParaPFField = document.getElementById('freteParaPF');
    const calcular = document.getElementById('calcular');
    const limpar = document.getElementById('limpar');

    const icmsTaxas = {
        SC: { MT: 7, PR: 12, SC: 17, MS: 7, GO: 7, MG: 12, SP: 12, RS: 12 },
        PR: { MT: 7, PR: 0, SC: 12, MS: 7, GO: 7, MG: 12, SP: 12, RS: 12 },
        MT: { MT: 0, PR: 12, SC: 12, MS: 12, GO: 12, MG: 12, SP: 12, RS: 12}
    };

    function obterTaxaICMS(estadoOrigem, estadoDestino) {
        return icmsTaxas[estadoOrigem][estadoDestino];
    }

    function calcularFreteParaPJ(valorFrete, margem, taxaICMS) {
        const totalPorcentagem = margem + taxaICMS;
        const descontoTotal = valorFrete * (totalPorcentagem / 100);
        return valorFrete - descontoTotal;
    }

    function calcularFreteParaPF(valorFrete, margem, taxaICMS) {
        const totalPorcentagem = margem + taxaICMS + 3.25; 
        const descontoTotal = valorFrete * (totalPorcentagem / 100);
        return valorFrete - descontoTotal;
    }

    calcular.addEventListener('click', function() {
        const valorFrete = parseFormattedNumber(valordoFrete.value);
        const margemValor = parseFloat(margem.value);
        const estadoOrigemValor = estadoOrigem.value;
        const estadoDestinoValor = estadoDestino.value;     

        if (isNaN(valorFrete) || isNaN(margemValor) || estadoOrigemValor === '' || estadoDestinoValor === '') {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }        
        
        if (!icmsTaxas.hasOwnProperty(estadoOrigemValor) || !icmsTaxas[estadoOrigemValor].hasOwnProperty(estadoDestinoValor)) {
            alert('Taxa de ICMS não encontrada para a combinação de estados selecionados.');
            return;
        }

        const taxaICMS = obterTaxaICMS(estadoOrigemValor, estadoDestinoValor);

        const freteParaPJ = calcularFreteParaPJ(valorFrete, margemValor, taxaICMS);
        const freteParaPF = calcularFreteParaPF(valorFrete, margemValor, taxaICMS);

        freteParaPJField.value = formatNumber(freteParaPJ);
        freteParaPFField.value = formatNumber(freteParaPF);
    });

    limpar.addEventListener('click', function() {
        valordoFrete.value = '';
        margem.value = '10';
        freteParaPJField.value = '';
        freteParaPFField.value = '';
    });
});