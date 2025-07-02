function formatarNumero(valor) {
    const numero = Number(valor);
    return isNaN(numero) ? valor : new Intl.NumberFormat('pt-BR').format(numero);
}

async function carregarDadosEstados() {
    try {
        const resposta = await fetch("https://covid19-brazil-api.now.sh/api/report/v1");

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();
        const corpoTabela = document.querySelector("#tabela-estados tbody") || document.querySelector("#estados-br");

        let somaCasos = 0;
        let somaSuspeitos = 0;
        let somaObitos = 0;

        let maiorProporcao = -Infinity;
        let menorProporcao = Infinity;
        let estadoMaiorProporcao = '';
        let estadoMenorProporcao = '';

        for (const estado of dados.data) {
            const casos = Number(estado.cases);
            const obitos = Number(estado.deaths);
            const suspeitos = Number(estado.suspects);

            somaCasos += casos;
            somaSuspeitos += suspeitos;
            somaObitos += obitos;

            const proporcao = obitos === 0 ? Infinity : casos / obitos;

            if (proporcao > maiorProporcao) {
                maiorProporcao = proporcao;
                estadoMaiorProporcao = estado.uf;
            }

            if (proporcao < menorProporcao) {
                menorProporcao = proporcao;
                estadoMenorProporcao = estado.uf;
            }
        }

        const mediaCasos = somaCasos / dados.data.length;
        const mediaSuspeitos = somaSuspeitos / dados.data.length;
        const mediaObitos = somaObitos / dados.data.length;

        for (const estado of dados.data) {
            const linha = document.createElement("tr");

            const casos = Number(estado.cases);
            const obitos = Number(estado.deaths);

            if (obitos > mediaObitos) linha.classList.add("acima-media");
            if (estado.uf === estadoMaiorProporcao) linha.classList.add("maior-relacao");
            if (estado.uf === estadoMenorProporcao) linha.classList.add("menor-relacao");

            linha.innerHTML = `
                <td>${estado.state}</td>
                <td>${estado.uf}</td>
                <td>${formatarNumero(estado.cases)}</td>
                <td>${formatarNumero(estado.suspects)}</td>
                <td>${formatarNumero(estado.deaths)}</td>
            `;

            corpoTabela.appendChild(linha);
        }

        document.getElementById("media-num-casos").textContent = `Média de casos confirmados: ${formatarNumero(mediaCasos.toFixed(2))}`;
        document.getElementById("media-num-suspeitos").textContent = `Média de casos suspeitos: ${formatarNumero(mediaSuspeitos.toFixed(2))}`;
        document.getElementById("media-num-falecimentos").textContent = `Média de óbitos: ${formatarNumero(mediaObitos.toFixed(2))}`;

    } catch (erro) {
        console.error("Erro ao obter dados:", erro);
    }
}

carregarDadosEstados();
