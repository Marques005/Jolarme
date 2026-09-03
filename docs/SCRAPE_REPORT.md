# Auditoria pública de jolarme.pt

Data da recolha: 3 de setembro de 2026.

## Resumo

O site público não expõe uma API REST/JSON moderna. O frontend é uma aplicação PHP com sessão (`PHPSESSID`) que devolve páginas ou fragmentos HTML. A atualização dinâmica é feita sobretudo com `jQuery.load()` e `$.ajax()`; carrinho, login, pesquisa, comparação e grelhas de produtos dependem desses fragmentos.

Esta lista representa os endpoints **observáveis a partir do frontend público e dos seus JavaScript**, não uma enumeração do backend privado. Não foram feitos login real, checkout, mutações no carrinho real nem tentativas de acesso a rotas administrativas.

## Arquitetura observada

- Servidor nginx e `X-Powered-By: PHP/5.3.29`.
- Documento XHTML 1.0 Transitional e encoding Windows-1252 em várias páginas.
- jQuery 3.6.3 no documento principal; um iframe de novidades ainda carrega jQuery 1.8.3.
- Layout desktop fixo de 1800 px, construído com tabelas.
- Deteção de largura através de POST e redirecionamento para uma árvore móvel separada em `/m/`.
- Conteúdo crítico carregado após o primeiro HTML: montra, listagens, detalhe, login e carrinho.
- Múltiplos iframes para carrinho, comparação, pesquisa avançada, novidades, votação e cookies.
- URLs SEO coexistem com os controladores PHP antigos.

## Endpoints públicos observados

### Páginas e navegação

| Método | Endpoint | Parâmetros/uso |
|---|---|---|
| GET/POST | `/` e `/index.php` | Homepage; POST `sjawi` comunica largura do viewport. |
| GET | `/info/listar.php` | `procurar`, `campo`, `ltipa`, `marca_id`, `xpag`, `ordena`, `ordem_lista`, `slim`, `listind`, `rangemin`, `rangemax`. |
| GET | `/info/listar_categoria.php` | `nivelm`, `id`, `lpfiltro`, `filtro_de`, `filtro_ate`, paginação e ordenação. |
| GET | `/info/ver_produtos.php?id=:id` | Página canónica de produto; também existe URL SEO terminada em `-:id.html`. |
| GET | `/info/listar_identicos.php` | `tcaract`, `catid`, `scatid`, `rid`, `larguraid`, `nome`. |
| GET | `/info/compras_adicionar.php` | Página completa do carrinho/checkout. |
| GET/POST | `/info/contactos.php` | Página e formulário público de contacto. |
| GET | `/pag/:slug-:id.html` | Termos, devoluções, privacidade e recrutamento. |
| GET | `/m/...` | Duplicação móvel de listagem, produto e restantes páginas. |

As categorias também usam rewrites SEO como `/:slug-:id-tipo-lpc`, `/:slug-:id-categoria-lpc` e `/:slug-:id-subcategoria-lpc` dentro de `/info/`.

### Catálogo e pesquisa (fragmentos HTML)

| Método | Endpoint | Parâmetros/uso |
|---|---|---|
| GET | `/blocos/montra_corev2_normal.php` | `teste`, `width_disponivel`; montra da homepage. |
| GET | `/info/listar_corev2.php` | Listagem geral; `width_disponivel`, `id`, `subm_ini`, `procurar`, `xpag`, `ordem_lista`, `ordena`, `ltipa`, `slim`, `lpfiltro`, `listind`, `rangemin`, `rangemax`. |
| GET | `/info/listar_categoria_corev2.php` | Listagem por taxonomia; acrescenta `nivelm`, `filtro_de`, `filtro_ate`, `num_seguinte`. |
| GET | `/info/ver_produtos_core.php` | `id`, `saltasn`, `favor_img`; fragmento principal da ficha de produto. |
| GET | `/blocos/search.php` | `procurar`; autocomplete a partir de 2 caracteres. |
| GET | `/blocos/bloco_pesquisa_av.php` | `tipo`, `categoria`, `subcategoria`, `produto`, `marca`, `preco_desde`, `preco_ate`, `codigo`, `entra`. |
| GET | `/blocos/scroll_produtos.php` | Novidades apresentadas no iframe lateral. |
| GET | `/blocos/listas_botoes_apoio.php` | `caminho`, `id`, `tipo_iframe`; ações por produto na listagem. |
| GET | `/blocos/mini_album.php` | `id`; galeria rápida. |
| GET | `/blocos/bloco_votar.php` | `id`; votação/avaliação em iframe. |

As respostas acima são HTML com JavaScript embebido, e não JSON. A ordenação observada usa `nome`, `valor_principal`, `op5` (entrada) e `contador` (vendas), com `ordem_lista=asc|desc`. `ltipa=1|2|3` muda o modo de grelha/lista e `listind=1` é usado pela opção “só promoções”.

### Carrinho

| Método | Endpoint | Parâmetros/uso |
|---|---|---|
| GET | `/blocos/lcompra.php?id=:id` | Modal de confirmação e cálculo de IVA. |
| POST | `/blocos/lcompra.php` | `id`, `quantidades`, `confirma`, `fqtd`; adiciona ao carrinho de sessão. |
| GET | `/blocos/carrinho_topo.php` | Apresentação e mutação: `apagar=1`, `mais=1`, `menos=1`, `qtdv`, `id`; também recebe opções visuais. |
| GET | `/blocos/carrinho_compras_lateral.php` | `proc`; conteúdo/limpeza do carrinho lateral. |

O site atual faz mutações através de GET em alguns fluxos, o que deve ser substituído por POST/PATCH/DELETE numa integração nova.

### Conta, favoritos e comparação

| Método | Endpoint | Parâmetros/uso |
|---|---|---|
| GET | `/blocos/login_topo.php` | `width_bllogin`, `btlognome`, `xlogin`, `xpassword`, `dic`, `local`, `dologin`, `ck`. |
| GET | `/clientes/registo.php` | `retpc`; registo de utilizador. |
| GET | `/clientes/recuperar.php` | Recuperação de password. |
| GET | `/comum/favoritos.php` | `id`, `tipo=adicionar|retirar`. |
| GET | `/comum/comparador.php` | `id`, `tipo=add|del`. |
| GET | `/blocos/comparador.php` | `efipro`; interface do comparador. |

O login público observado envia credenciais na query string de um GET. Isso não foi reproduzido: o protótipo usa POST JSON e devolve apenas uma sessão fictícia.

### Recursos auxiliares

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/rss.php` | Feed de novidades. |
| GET | `/comum/cookies.php` | Banner de cookies em iframe, com `caminho`. |
| GET | `/comum/muda_idioma.php` | `idioma`. |
| GET | `/comum/topocss.php`, `/comum/headcss.php`, `/comum/produto_css.php` | CSS gerado por PHP, com parâmetro de caminho relativo. |
| GET | `/info/imprimir.php?id=:id` | Ficha de impressão do produto. |

## Fragilidades do frontend atual

1. A largura fixa e a árvore móvel duplicada tornam manutenção e responsividade mais caras.
2. Listagens e produto dependem de JavaScript para obter conteúdo essencial, embora as páginas já façam renderização no servidor.
3. Iframes e fragmentos HTML espalham estado e navegação por múltiplos documentos.
4. Mutações por GET e credenciais na query string são padrões inseguros.
5. PHP 5.3, XHTML, tabelas de layout e versões antigas de jQuery aumentam risco e dificultam evolução.
6. Encoding misto provoca texto corrompido em alguns agentes e páginas indexadas.
7. O design desktop desperdiça espaço em ecrãs menores e comprime navegação/produtos em layouts intermédios.

## Contrato da API mock criada

| Método | Endpoint Next.js | Substitui o conceito antigo |
|---|---|---|
| GET | `/api/categories` | Mega menu e taxonomias embebidas no HTML. |
| GET | `/api/products` | `listar_corev2.php` e `listar_categoria_corev2.php`. |
| GET | `/api/products/:id-or-slug` | `ver_produtos.php` + `ver_produtos_core.php`. |
| GET | `/api/search?q=` | `blocos/search.php?procurar=`. |
| GET/POST | `/api/cart` | `lcompra.php` e fragmentos do carrinho. |
| POST | `/api/auth/login` | `login_topo.php?...dologin=1`. |
| POST | `/api/contact` | Formulário de contactos. |
| GET | `/api/health` | Novo endpoint operacional. |

### Filtros de `/api/products`

- `q`: pesquisa em nome, referência, marca e subcategoria.
- `categoria` ou `category`: slug de categoria.
- `marca` ou `brand`: marca exata.
- `stock`: `available`, `limited` ou `unavailable`.
- `ordem` ou `sort`: `featured`, `price-asc`, `price-desc`, `name`, `newest`.
- `pagina` ou `page`: página, começando em 1.
- `limit`: 1 a 48.
- `featured=1`: apenas destaques.

Exemplo de envelope:

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 12,
    "pages": 1,
    "source": "mock"
  },
  "filters": {
    "categories": [],
    "brands": [],
    "active": {}
  }
}
```

Erros seguem `{ "error": { "code": "...", "message": "..." } }` com HTTP 4xx adequado.

## Implementação do protótipo

- 8 famílias do catálogo e 17 produtos de amostra.
- Nomes, referências, preços, disponibilidade e fotografias inspirados na montra pública recolhida.
- Homepage, catálogo, detalhe, carrinho e contacto responsivos.
- Pesquisa instantânea ligada a `/api/search`.
- Catálogo ligado a `/api/products`, incluindo filtros e ordenação.
- Carrinho persistido em `localStorage`; nenhuma mutação é enviada para o site real.
- Login e contacto demonstrativos através de POST, sem credenciais ou mensagens reais.

## Limitações da recolha

O browser integrado não estava disponível na sessão. A análise foi feita por pedidos HTTP aos recursos públicos, leitura dos HTML/JavaScript devolvidos e comparação com páginas indexadas. Isto permitiu mapear os contratos usados pelo frontend, mas não captura endpoints acionados apenas depois de autenticação, integrações de pagamento, rotas administrativas ou chamadas condicionais não presentes nas páginas públicas analisadas.
