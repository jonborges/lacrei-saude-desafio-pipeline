const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();
app.disable('x-powered-by');

const rotaStatus = '/status';

app.use(helmet({
  frameguard: { action: 'deny' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginEmbedderPolicy: { policy: "require-corp" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"], 
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"]
    },
  },
}));


app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', "camera=(), microphone=(), geolocation=()");
  next();
});


app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, path) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));


app.get(['/sitemap.xml', '/robots.txt'], (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('');
});


app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Lacrei Saúde</title>
      <link rel="stylesheet" href="/style.css">
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
