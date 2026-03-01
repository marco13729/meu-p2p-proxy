const express = require('express');
const axios = require('axios');
const { spawn } = require('child_process');
const app = express();

const TARGET = "http://dvnpdois.sbs";
const USER_REAL = "aG82ZR8Xv3";
const PASS_REAL = "mNXWvvAYEt";

// 1. APERTO DE MÃO E LOGIN (O que você via no Cloudflare)
app.get('/player_api.php', async (req, res) => {
    try {
        const url = `${TARGET}/player_api.php${req.url.split('?')[1]}`
            .replace('username=88778851', `username=${USER_REAL}`)
            .replace('password=cspro', `password=${PASS_REAL}`);
        
        const response = await axios.get(url);
        res.json(response.data); // Entrega validade e lista de canais
    } catch (e) {
        res.status(500).send("Erro no Login");
    }
});

// 2. CONVERSÃO BRUTA DE CANAIS (FFmpeg Processando o Payload)
app.get('/:type/:username/:password/:id.:ext', (req, res) => {
    const streamUrl = `${TARGET}/${req.params.type}/${USER_REAL}/${PASS_REAL}/${req.params.id}.${req.params.ext}`;
    
    console.log("Iniciando conversão potente de Payload...");

    // Comando FFmpeg para converter P2P em fluxo HTTP legível
    const ffmpeg = spawn('ffmpeg', [
        '-i', streamUrl,          // Entrada: O Payload P2P bruto
        '-c', 'copy',             // Eficiência: Copia o vídeo sem re-encodar (leve)
        '-f', 'mpegts',           // Conversão: Transforma em formato IPTV padrão
        'pipe:1'                  // Saída: Envia direto para o Smarters
    ]);

    res.setHeader('Content-Type', 'video/mp2t');
    ffmpeg.stdout.pipe(res); // Conecta o motor de conversão ao seu app

    ffmpeg.stderr.on('data', (data) => {
        // Log de processamento (útil para ver o "braço" do servidor trabalhando)
    });

    req.on('close', () => {
        ffmpeg.kill(); // Mata o processo quando você desliga a TV para não gastar CPU
    });
});

app.listen(3000, () => console.log("Servidor de Conversão Ativo na porta 3000"));
