const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

const arquivoMotos = path.join(__dirname, "motos.json");
const motos = JSON.parse(fs.readFileSync(arquivoMotos, "utf8"));

app.use(cors());
app.use(express.json());

// Disponibiliza as imagens que estão na pasta principal AULA.
app.use("/imagens", express.static(path.join(__dirname, "..")));

function imagemCompleta(arquivo) {
    return `/imagens/${arquivo}`;
}

// Retorna uma moto aleatória.
app.get("/api/moto", (req, res) => {
    const marcas = Object.keys(motos);
    const marca = marcas[Math.floor(Math.random() * marcas.length)];
    const imagens = motos[marca];
    const imagem = imagens[Math.floor(Math.random() * imagens.length)];

    res.json({
        marca,
        imagem: imagemCompleta(imagem)
    });
});

// Procura uma moto pela marca.
app.get("/api/moto/:marca", (req, res) => {
    const busca = req.params.marca
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const marcaEncontrada = Object.keys(motos).find(marca =>
        busca.includes(marca.toLowerCase()) ||
        marca.toLowerCase().includes(busca)
    );

    if (!marcaEncontrada) {
        return res.status(404).json({
            erro: "Marca não encontrada. Tente Honda, BMW, Kawasaki ou Yamaha."
        });
    }

    const imagens = motos[marcaEncontrada];
    const imagem = imagens[Math.floor(Math.random() * imagens.length)];

    res.json({
        marca: marcaEncontrada,
        imagem: imagemCompleta(imagem)
    });
});

app.listen(PORT, () => {
    console.log(`API de motos rodando em http://localhost:${PORT}`);
});