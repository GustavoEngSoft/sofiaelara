# Sofia & Lara — Site missionário (scaffold)

Este repositório contém um scaffold simples em HTML/CSS/JS para um site mobile que apresenta a história de duas jovens chamadas ao ministério, com fotos, testemunhos, galeria, contador de orações e seção de doações via PIX.

Principais arquivos:

- `index.html` — marcação principal
- `css/styles.css` — estilos (mobile-first)
- `js/script.js` — interações: carrossel, lightbox, contador e modal PIX

Como usar:

1. Copie suas fotos para `assets/` (ex.: `assets/photo1.jpg`, `assets/placeholder-portrait.jpg`).
2. Abra `index.html` no navegador.

Contador de orações:

- O contador usa Firebase Firestore em `js/script.js` com o projeto `sofiaelara-6fff1`.
- O documento do contador está em `site/config` e é criado com `count = 0` se ainda não existir.
- Se o Firebase não estiver configurado, o site ainda mostra o contador localmente, mas sem persistir um valor fixo no código.

PIX / Doações:

- Atualize `PIX_KEY` em `js/script.js` com a chave real.
- O modal mostra um espaço para o QR; substitua `qr-placeholder` pelo SVG/PNG do QR code.

WhatsApp:

- Substitua `55XXXXXXXXXXX` no link do botão fixo pelo seu número com DDI e DDD.

Próximos passos que posso implementar:

- Integração com Firebase/Firestore para contador global.
- Backend serverless pronto para receber e validar incrementos.
- Melhorar acessibilidade e animações conforme mockup.
