# Jolarme — protótipo Next.js

Reinterpretação moderna e responsiva da loja pública da Jolarme, construída em Next.js 15 com catálogo, pesquisa, filtros, detalhe de produto, carrinho, login demo e contacto.

O projeto usa fotografias públicas de produtos da Jolarme e **mock data local**. Nenhuma compra, autenticação ou mensagem é enviada para o sistema real.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

Para validar a versão de produção:

```bash
npm run build
npm start
```

## Páginas

- `/` — homepage moderna
- `/produtos` — catálogo com pesquisa, categoria, marca, ordenação e paginação
- `/produtos/[slug]` — detalhe, especificações, produtos relacionados e compra
- `/carrinho` — carrinho persistente no browser
- `/contactos` — formulário funcional sobre endpoint mock

## API mock

- `GET /api/health`
- `GET /api/categories`
- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/search?q=camara`
- `GET|POST /api/cart`
- `POST /api/auth/login`
- `POST /api/contact`

O contrato e o mapeamento para o sistema PHP observado estão detalhados em [`docs/SCRAPE_REPORT.md`](docs/SCRAPE_REPORT.md).

## Dados e arquitetura

- Catálogo central em `lib/mock-data.ts`
- Tipos em `lib/types.ts`
- Estado do carrinho em `components/cart-context.tsx`, persistido em `localStorage`
- Route Handlers em `app/api`
- Imagens locais em `public/products`

Para ligar um backend real, as páginas podem continuar a consumir o mesmo contrato `/api/*`; basta substituir a origem dos Route Handlers por um cliente HTTP/SDK.
