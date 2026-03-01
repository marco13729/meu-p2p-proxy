const express = require('express');
const axios = require('axios');
const app = express();

const TARGET = "http://dvnpdois.sbs";
const USER = "aG82ZR8Xv3";
const PASS = "mNXWvvAYEt";

app.get('/', (req, res) => res.send("PROXY_ATIVO_GITHUB"));

app.get('*', async (req, res) => {
    try {
        const url = `${TARGET}${req.url}`
            .replace('username=88778851', `username=${USER}`)
            .replace('password=cspro', `password=${PASS}`);
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        res.set(response.headers);
        res.send(response.data);
    } catch (e) {
        res.status(500).send("Erro");
    }
});

module.exports = app;
