// Função para buscar os dados quando o botão de busca é clicado

document.addEventListener("DOMContentLoaded", init); //chamar apos o dom ser carregado
function init() {
  document.getElementById("searchBtn").addEventListener("click", search);
}

async function search() {
  const keyword = document.getElementById("inputSearch").value;

  console.log(keyword);
  try {
    const response = await fetch(
      `http://localhost:3000/api/search/?search=${keyword}`
    );
    const data = await response.json();
    showResults(data);
  } catch (error) {
    console.error("Erro:", error);
    displayError("Erro ao buscar dados. Por favor, tente novamente.");
  }
}
//Função para exibir os resultados na pagina
//Criando o Html que vai ser inserido com os dados de cada produto

function showResults(products) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  products.forEach((product) => {
    const productHTML = `
        <div class="product">
          <h3>${product.title}</h3>
          <p>Avaliação: ${product.rating}</p>
          <p>Número de avaliações: ${product.reviewCount}</p>
          <img src="${product.imageUrl}" alt="${product.title}">
        </div>
      `;

    resultsDiv.innerHTML += productHTML;
  });
}

//exibir mensagens de erro
function displayError(message) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `<p style="color: red;">${message}</p>`;
}
