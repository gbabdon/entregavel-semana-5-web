# entregavel-semana-5-web

Entregável de Desenvolvimento Web – Semana 05
Objetos, Dados e Assincronismo
Descrição do projeto

Este projeto foi desenvolvido como atividade prática da Semana 05 da disciplina de Desenvolvimento Web. O objetivo é aplicar conceitos de objetos, arrays, validação de dados, assincronismo, consumo de APIs e manipulação dinâmica do DOM utilizando JavaScript.

Parte 1 – Manipulação e validação de pedidos

O projeto utiliza um array de objetos para representar pedidos de clientes.

filter: valida os pedidos, verificando se o cliente não está vazio e se o valor é numérico e maior que zero. Também filtra os pedidos com status "pago".
reduce: calcula o total faturado somando os valores dos pedidos pagos e válidos.
map: gera textos com o nome do cliente e o valor do pedido.
toFixed(2): formata os valores com duas casas decimais.
Parte 2 – Buscador de CEP

O buscador utiliza a API ViaCEP para consultar informações de endereços.

A aplicação valida se o CEP contém exatamente oito dígitos numéricos, utilizando trim() e expressões regulares.

A requisição é realizada com fetch, async e await. O código verifica response.ok, trata falhas de conexão e utiliza AbortSignal.timeout(5000) para limitar o tempo de espera.

Os resultados são exibidos dinamicamente com createElement, textContent e replaceChildren().

O projeto também possui um histórico dos CEPs pesquisados durante o uso da página.

Parte 3 – Mini Pokédex

A Pokédex utiliza a API PokéAPI para pesquisar Pokémon pelo nome.

O nome digitado é validado, removendo espaços externos e convertendo o texto para letras minúsculas.

A aplicação exibe o nome do Pokémon, sua imagem e seus tipos. Também trata erros HTTP, incluindo o status 404, e falhas de conexão.

Os quatro estados da tela
Carregando: apresenta uma mensagem enquanto a requisição está em andamento e desabilita o botão.
Erro: informa falhas de conexão, erros HTTP ou problemas durante a requisição.
Vazio ou não encontrado: informa quando o CEP não existe ou quando o Pokémon não é encontrado.
Sucesso: exibe os dados retornados pela API.
Parte 4 – Reflexão sobre Promise.all
Por que Promise.all pode ser mais rápido que vários await seguidos?

O uso de vários await sequenciais faz com que cada operação aguarde a conclusão da anterior antes de iniciar a próxima. Isso pode aumentar o tempo total de execução quando as requisições são independentes.

Com Promise.all, as requisições podem ser iniciadas em paralelo. O programa aguarda todas as Promises serem concluídas, aproveitando melhor o tempo de rede e reduzindo o tempo total de espera.

Por exemplo:

// Execução sequencial
const resposta1 = await fetch(url1);
const resposta2 = await fetch(url2);

// Execução em paralelo
const [respostaA, respostaB] = await Promise.all([
    fetch(url1),
    fetch(url2)
]);


O Promise.all rejeita se alguma das Promises rejeitar, por isso é importante considerar o tratamento de erros. Além disso, o fetch não rejeita automaticamente em respostas HTTP como 404 ou 500; é necessário verificar response.ok.

Event Loop e assincronismo

O Event Loop coordena a execução do JavaScript. De forma simplificada, o código síncrono é executado primeiro; depois são processadas as microtarefas, como continuações de Promises e await; e, em seguida, são processadas tarefas, como callbacks de setTimeout, conforme as regras da fila de eventos.

Tecnologias utilizadas
HTML5
CSS3
JavaScript ES6+
Fetch API
ViaCEP
PokéAPI
Promises e async/await
Como executar
Abra o arquivo index.html em um navegador com acesso à internet.
Pressione F12 para abrir as ferramentas de desenvolvedor.
Teste a validação e os resultados dos pedidos.
Pesquise um CEP válido no buscador.
Pesquise Pokémon pelo nome, como pikachu.
Observe as mensagens de carregamento, sucesso e erro.
