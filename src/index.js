const express = require('express');
const helmet = require('helmet');

const app = express();
app.disable('x-powered-by');

const rotaStatus = '/status';

app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin" }));
app.use(helmet.crossOriginEmbedderPolicy({ policy: "require-corp" }));
app.use(helmet.crossOriginResourcePolicy({ policy: "same-origin" }));
app.use(helmet.permissionsPolicy({ policy: { camera: [], microphone: [], geolocation: [] } }));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
  },
}));

app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Lacrei Saúde</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                background-color: #f0f2f5;
                color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                text-align: center;
                background-color: white;
                padding: 40px 50px;
                border-radius: 12px;
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
            }
            h1 { color: #0d6efd; margin-bottom: 15px; }
            p { font-size: 1.1em; color: #555; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>API Desafio Lacrei Saúde</h1>
            <p>Serviço no ar!</p>
        </div>
    </body>
    </html>
  `);
});

app.get(rotaStatus, (req, res) => {
  const resposta = { status: 'OK', timestamp: new Date().toISOString() };
  res.json(resposta);
});

const porta = process.env.PORT || 3000;
const server = app.listen(porta, () => {
  console.log(`🚀 Servidor subiu com sucesso na porta ${porta}!`);
});

process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM. Encerrando o servidor...');
  server.close(() => {
    console.log('Servidor encerrado.');
    process.exit(0);
  });
});

module.exports = server;
