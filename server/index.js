import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";
import cors from "cors";

const app = express();
const PORT = 3000;

//criação da rota

app.use(cors()); //autorização
app.get("/api/search", async (req, res) => {
  try {
    const productsData = [];
    const search = req.query.search;
    console.log(search);
    if (!search) {
      return res
        .status(400)
        .json({ error: 'Parâmetro "search" não fornecido' });
    }
    const response = await axios.get(`https://www.amazon.com/s?k=${search}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    //usar o jsdom para trabalhar com o dom no node
    const dom = new JSDOM(response.data);

    const productList = dom.window.document.querySelectorAll("div[data-asin]");

    //passando por cada elemento, pegando o conteudo nescessario

    productList.forEach((product) => {
      const titleElement = product.querySelector("h2");
      const ratingElement = product.querySelector(
        ".a-icon-star-small .a-icon-alt"
      );
      const reviewCountElement = product.querySelector(
        ".a-size-small .a-link-normal"
      );
      const imageElement = product.querySelector("img");

      if (titleElement && ratingElement && reviewCountElement && imageElement) {
        const title = titleElement.textContent;
        const rating = ratingElement.textContent;
        const reviewCount = reviewCountElement.textContent;
        const imageUrl = imageElement.src;

        //salvando no array
        productsData.push({
          title,
          rating,
          reviewCount,
          imageUrl,
        });
      } else {
        console.log(
          "Elemento necessário não foi encontrado para este produto."
        );
      }
    });

    res.json(productsData);
  } catch (error) {
    console.error("Erro:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//rodar o servidor
app.listen(PORT, () => {
  console.log(`server run, porta ${PORT}`);
});
