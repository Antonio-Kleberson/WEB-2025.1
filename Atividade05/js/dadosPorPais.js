function formatarNumeroBR(valor) {
    const numero = Number(valor);
    return isNaN(numero) ? valor : new Intl.NumberFormat('pt-BR').format(numero);
}

async function carregarDadosPaises() {
    try {
        const resposta = await fetch("https://covid19-brazil-api.now.sh/api/report/v1/countries");

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();
        const corpoTabela = document.querySelector("#tabela-paises tbody") || document.querySelector("#pais");

        let somaCasos = 0;
        let somaObitos = 0;

        let paisMaiorRelacao = "";
        let paisMenorRelacao = "";
        let maiorRelacao = -Infinity;
        let menorRelacao = Infinity;

        dados.data.forEach(pais => {
            const confirmados = Number(pais.confirmed);
            const obitos = Number(pais.deaths);

            somaCasos += confirmados;
            somaObitos += obitos;

            const relacao = obitos === 0 ? Infinity : confirmados / obitos;

            if (relacao > maiorRelacao) {
                maiorRelacao = relacao;
                paisMaiorRelacao = pais.country;
            }

            if (relacao < menorRelacao) {
                menorRelacao = relacao;
                paisMenorRelacao = pais.country;
            }
        });

        const mediaCasos = somaCasos / dados.data.length;
        const mediaObitos = somaObitos / dados.data.length;

        dados.data.forEach(pais => {
            const linha = document.createElement("tr");
            const confirmados = Number(pais.confirmed);
            const obitos = Number(pais.deaths);

            if (obitos > mediaObitos) linha.classList.add("acima-media");
            if (pais.country === paisMaiorRelacao) linha.classList.add("maior-relacao");
            if (pais.country === paisMenorRelacao) linha.classList.add("menor-relacao");

            const destaqueBrasil = pais.country === "Brazil"
                ? 'style="border: 5px solid #b22222;"'
                : "";

            linha.innerHTML = `
                <td ${destaqueBrasil}>${pais.country}</td>
                <td>${formatarNumeroBR(confirmados)}</td>
                <td>${formatarNumeroBR(obitos)}</td>
            `;

            corpoTabela.appendChild(linha);
        });

        document.getElementById("media-num-casos").textContent =
            `Média dos casos confirmados: ${formatarNumeroBR(mediaCasos.toFixed(2))}`;

        document.getElementById("media-num-falecimentos").textContent =
            `Média dos óbitos: ${formatarNumeroBR(mediaObitos.toFixed(2))}`;

    } catch (erro) {
        console.error("Erro ao buscar dados dos países:", erro);
    }
}

carregarDadosPaises();
