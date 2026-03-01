const express = require('express');
const axios = require('axios');
const app = express();

const TARGET = "http://dvnpdois.sbs";
const USER = "aG82ZR8Xv3";
const PASS = "mNXWvvAYEt";

// FOCO TOTAL NO APERTO DE MÃO (LOGIN)
app.get('/player_api.php', async (req, res) => {
    try {
        const params = req.query;
        const url = `${TARGET}/player_api.php?username=${USER}&password=${PASS}&action=${params.action || ''}`;
        
        const response = await axios.get(url, { timeout: 10000 });
        res.json(response.data); // Isso deve trazer os dias de validade
    } catch (e) {
        res.status(500).send("Erro de Conexão");
    }
});

// REDIRECIONAMENTO SIMPLES (Sem FFmpeg para não travar a Vercel)
app.get('/:type/:user/:pass/:id', (req, res) => {
    const streamUrl = `${TARGET}/${req.params.type}/${USER}/${PASS}/${req.params.id}`;
    res.redirect(streamUrl); // Tenta enviar o payload direto
});

module.exports = app;
