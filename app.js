// ==========================================
// SEMANA 05 - OBJETOS, DADOS E ASSINCRONISMO
// ==========================================


// ==========================================
// PARTE 1 - MANIPULAÇÃO E VALIDAÇÃO DE PEDIDOS
// ==========================================

console.log("===== PARTE 1 - PEDIDOS =====");

const pedidos = [
    { cliente: "Bia", valor: 120, status: "pago" },
    { cliente: "Carlos", valor: 80, status: "pendente" },
    { cliente: "Ana", valor: 200, status: "pago" },
    { cliente: "", valor: 50, status: "pago" },
    { cliente: "Pedro", valor: -10, status: "pago" },
    { cliente: "Mariana", valor: 75, status: "pago" }
];

// Validar: cliente não vazio e valor numérico maior que zero
const pedidosValidos = pedidos.filter(pedido => {
    return (
        typeof pedido.cliente === "string" &&
        pedido.cliente.trim() !== "" &&
        typeof pedido.valor === "number" &&
        Number.isFinite(pedido.valor) &&
        pedido.valor > 0
    );
});

console.log("Pedidos válidos:", pedidosValidos);

// Selecionar somente os pedidos pagos
const pedidosPagos = pedidosValidos.filter(
    pedido => pedido.status === "pago"
);

console.log("Pedidos pagos:", pedidosPagos);

// Calcular o total faturado
const totalFaturado = pedidosPagos.reduce(
    (total, pedido) => total + pedido.valor,
    0
);

console.log("Total faturado: R$", totalFaturado.toFixed(2));

// Criar textos com nome e valor
const resumoPedidos = pedidosPagos.map(
    pedido => `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`
);

console.log("Resumo dos pedidos:", resumoPedidos);

// Exibir os resultados na página
const listaPedidos = document.querySelector("#lista-pedidos");
const elementoTotal = document.querySelector("#total-faturado");

resumoPedidos.forEach(texto => {
    const item = document.createElement("li");
    item.textContent = texto;
    listaPedidos.append(item);
});

elementoTotal.textContent =
    `Total faturado: R$ ${totalFaturado.toFixed(2)}`;


// ==========================================
// PARTE 2 - BUSCADOR DE CEP COM VIACEP
// ==========================================

console.log("===== PARTE 2 - BUSCADOR DE CEP =====");

const formularioCep = document.querySelector("#formulario-cep");
const campoCep = document.querySelector("#cep");
const botaoCep = document.querySelector("#botao-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const historicoCep = document.querySelector("#historico-cep");

// Histórico armazenado em memória durante o uso da página
const historico = [];

function mostrarStatusCep(mensagem, tipo = "") {
    statusCep.textContent = mensagem;
    statusCep.className = "status";

    if (tipo) {
        statusCep.classList.add(tipo);
    }
}

function mostrarDadosCep(dados) {
    // Remover os resultados anteriores
    resultadoCep.replaceChildren();

    const campos = [
        ["Rua", dados.logradouro],
        ["Bairro", dados.bairro],
        ["Cidade", dados.localidade],
        ["UF", dados.uf]
    ];

    campos.forEach(([rotulo, valor]) => {
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");

        dt.textContent = rotulo;
        dd.textContent = valor || "Não informado";

        resultadoCep.append(dt, dd);
    });
}

function atualizarHistoricoCep() {
    historicoCep.replaceChildren();

    historico.forEach(itemHistorico => {
        const item = document.createElement("li");

        item.className = "historico-item";
        item.textContent =
            `${itemHistorico.cep} — ${itemHistorico.cidade}`;

        historicoCep.append(item);
    });
}

formularioCep.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Limpar espaços externos e validar oito dígitos
    const cep = campoCep.value.trim();

    if (!/^\d{8}$/.test(cep)) {
        mostrarStatusCep(
            "Digite um CEP válido com exatamente 8 dígitos.",
            "erro"
        );

        resultadoCep.replaceChildren();
        return;
    }

    // Estado de carregamento
    botaoCep.disabled = true;
    mostrarStatusCep("Buscando...");
    resultadoCep.replaceChildren();

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`,
            { signal: AbortSignal.timeout(5000) }
        );

        // fetch não rejeita automaticamente em erros HTTP
        if (!resposta.ok) {
            throw new Error("Falha na conexão com o serviço de CEP.");
        }

        const dados = await resposta.json();

        // Estado de CEP não encontrado
        if (dados.erro) {
            mostrarStatusCep("CEP não encontrado.", "erro");
            resultadoCep.replaceChildren();
            return;
        }

        // Estado de sucesso
        mostrarDadosCep(dados);
        mostrarStatusCep("");

        // Guardar o CEP pesquisado no histórico
        historico.unshift({
            cep,
            cidade: dados.localidade || "Cidade não informada",
            uf: dados.uf || ""
        });

        atualizarHistoricoCep();

    } catch (erro) {
        console.error("Erro ao buscar CEP:", erro);

        if (erro.name === "TimeoutError" || erro.name === "AbortError") {
            mostrarStatusCep(
                "A busca demorou demais. Tente novamente.",
                "erro"
            );
        } else {
            mostrarStatusCep(
                "Falha na conexão. Verifique sua internet e tente novamente.",
                "erro"
            );
        }

        resultadoCep.replaceChildren();

    } finally {
        // Restaurar o botão independentemente do resultado
        botaoCep.disabled = false;
    }
});


// ==========================================
// PARTE 3 - MINI POKÉDEX COM POKÉAPI
// ==========================================

console.log("===== PARTE 3 - MINI POKÉDEX =====");

const formularioPokemon =
    document.querySelector("#formulario-pokemon");

const campoPokemon =
    document.querySelector("#nome-pokemon");

const botaoPokemon =
    document.querySelector("#botao-pokemon");

const statusPokemon =
    document.querySelector("#status-pokemon");

const resultadoPokemon =
    document.querySelector("#resultado-pokemon");

function mostrarStatusPokemon(mensagem, tipo = "") {
    statusPokemon.textContent = mensagem;
    statusPokemon.className = "status";

    if (tipo) {
        statusPokemon.classList.add(tipo);
    }
}

function mostrarPokemon(pokemon) {
    resultadoPokemon.replaceChildren();

    const titulo = document.createElement("h3");
    titulo.textContent =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    resultadoPokemon.append(titulo);

    const imagemUrl = pokemon.sprites.front_default;

    if (imagemUrl) {
        const imagem = document.createElement("img");

        imagem.src = imagemUrl;
        imagem.alt = `Imagem de ${pokemon.name}`;
        imagem.id = "pokemon-imagem";

        resultadoPokemon.append(imagem);
    } else {
        const avisoImagem = document.createElement("p");
        avisoImagem.textContent = "Imagem não disponível.";

        resultadoPokemon.append(avisoImagem);
    }

    const tituloTipos = document.createElement("h4");
    tituloTipos.textContent = "Tipos:";

    resultadoPokemon.append(tituloTipos);

    const listaTipos = document.createElement("ul");

    pokemon.types.forEach(itemTipo => {
        const item = document.createElement("li");

        item.textContent = itemTipo.type.name;
        listaTipos.append(item);
    });

    resultadoPokemon.append(listaTipos);
}

formularioPokemon.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validar o nome e converter para minúsculas
    const nomePokemon = campoPokemon.value.trim().toLowerCase();

    if (nomePokemon === "") {
        mostrarStatusPokemon(
            "Digite o nome de um Pokémon.",
            "erro"
        );

        resultadoPokemon.replaceChildren();
        return;
    }

    // Estado de carregamento
    botaoPokemon.disabled = true;
    mostrarStatusPokemon("Buscando Pokémon...");
    resultadoPokemon.replaceChildren();

    try {
        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nomePokemon)}`,
            { signal: AbortSignal.timeout(5000) }
        );

        // Tratar erros HTTP, inclusive o 404
        if (resposta.status === 404) {
            throw new Error("POKEMON_NAO_ENCONTRADO");
        }

        if (!resposta.ok) {
            throw new Error("Falha na conexão com a PokéAPI.");
        }

        const pokemon = await resposta.json();

        // Estado de sucesso
        mostrarPokemon(pokemon);
        mostrarStatusPokemon("");

    } catch (erro) {
        console.error("Erro ao buscar Pokémon:", erro);

        if (erro.message === "POKEMON_NAO_ENCONTRADO") {
            mostrarStatusPokemon("Pokémon não encontrado.", "erro");
        } else if (
            erro.name === "TimeoutError" ||
            erro.name === "AbortError"
        ) {
            mostrarStatusPokemon(
                "A busca demorou demais. Tente novamente.",
                "erro"
            );
        } else {
            mostrarStatusPokemon(
                "Falha na conexão. Verifique sua internet e tente novamente.",
                "erro"
            );
        }

        resultadoPokemon.replaceChildren();

    } finally {
        // Restaurar o botão ao terminar
        botaoPokemon.disabled = false;
    }
});

console.log("Projeto da Semana 05 carregado com sucesso!");
