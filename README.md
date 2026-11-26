# Amakha Paris · Home

Reprodução da página inicial da Amakha Paris a partir do layout do Figma, feita como teste prático da Wicomm para a vaga de Desenvolvedor Front-end Júnior.

🔗 **Página publicada:** https://wicomm-teste-pratico.netlify.app/

## Sumário

- [O que foi feito](#o-que-foi-feito)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Tecnologias usadas](#tecnologias-usadas)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Decisões que tomei](#decisões-que-tomei)
- [Testes](#testes)
- [O que eu faria com mais tempo](#o-que-eu-faria-com-mais-tempo)
- [Uso de IA](#uso-de-ia)

## O que foi feito

**Seções da página:** barra de anúncio, header (busca, conta, favoritos, sacola e menu), hero, ofertas limitadas com contador regressivo, benefícios, três carrosséis de produtos, banners de lançamentos, cronograma capilar e consultor, blog, nossas causas, carrossel de redes sociais, newsletter e footer.

**Interações e funcionalidades:**

| Recurso | Como funciona |
|---|---|
| Carrosséis | Arrastar/rolar, setas, bolinhas de página e botão desabilitado nas pontas |
| Carrinho | "Comprar" adiciona o produto, abre o mini cart e atualiza o selo da sacola |
| Mini cart | Aumentar/diminuir quantidade, remover item, subtotal, barra de frete grátis, estado vazio |
| Persistência | O carrinho continua o mesmo ao recarregar a página (`localStorage`) |
| Menu mobile | Drawer lateral com overlay, fecha com ESC, clique fora ou ao escolher um link |
| Newsletter | Validação de nome e e-mail com mensagem de erro/sucesso |
| Footer | "Ver mais/Ver menos" no texto institucional |
| Contador | Regressivo, atualizado a cada segundo |
| Hover e foco | Botão "Comprar" e etiquetas nos cards, zoom leve nos banners, sublinhado nos links |

## Como rodar o projeto

**Pré-requisito:** Node.js 18 ou superior. Ele é usado só para servir a página e rodar os testes: o projeto **não tem dependências e não tem etapa de build**.

```bash
git clone https://github.com/NvMeireles/wicomm-teste-pratico.git
cd wicomm-teste-pratico

npm start     # serve a página em http://localhost:3000
npm test      # roda os testes automatizados
```

> A página precisa ser aberta por um servidor local, e não com duplo clique no `index.html`, porque os módulos JavaScript (`type="module"`) não carregam via `file://`.

Alternativas ao `npm start`: a extensão **Live Server** do VS Code ou `python -m http.server 8000`.

## Tecnologias usadas

- **HTML5 semântico**: `header`, `nav`, `main`, `section`, `article`, `footer`, `address`, `dialog`, `form`.
- **CSS puro** (sem pré-processador e sem framework): variáveis CSS, Grid, Flexbox, `aspect-ratio`, `scroll-snap`, `clamp`/`min`, `:has()` e media queries.
- **JavaScript puro** com módulos ES (`import`/`export`), sem bibliotecas.
- **Node.js** apenas para os testes (`node --test`, o test runner nativo) e para servir a página (`npx serve`).
- **Fontes:** Poppins e Inter (Google Fonts). **Imagens:** WebP para fotos e SVG para ícones e logos.

## Estrutura do projeto

```
├── index.html
├── css/
│   ├── tokens.css          cores, fonte e medidas do layout (variáveis)
│   ├── base.css            reset e utilitários (.visually-hidden, .skip-link)
│   ├── section.css         bloco de seção reaproveitado (título + conteúdo)
│   └── ...                 um arquivo por componente (header, carousel, mini-cart, footer...)
├── js/
│   ├── main.js             ponto de entrada: liga os módulos
│   ├── cart.js             estado do carrinho (lógica pura, sem DOM)
│   ├── mini-cart.js        interface do carrinho lateral
│   ├── carousel.js         carrossel reutilizável
│   ├── product-card.js     gera o HTML de um card de produto
│   ├── products.js         dados (demonstrativos) dos produtos
│   ├── menu.js             menu mobile
│   ├── newsletter.js       formulário de newsletter
│   ├── countdown.js        contador regressivo
│   └── footer.js           "Ver mais" do texto institucional
├── images/                 banners, blog, causas, redes sociais, footer, produtos e ícones
└── tests/
    └── cart.test.js
```

## Decisões que tomei

O PDF pedia que eu contasse o que decidi onde o layout não deixava claro. Estas são as decisões, com o motivo de cada uma.

### Stack e organização

- **JavaScript puro e CSS puro.** A página é de conteúdo, com poucas interações. React ou Tailwind aumentariam o peso e a complexidade sem necessidade, e assim eu consigo explicar.
- **CSS com tokens e um arquivo por componente**, nomeado em BEM (`product-card__price`). As cores e medidas do Figma ficam em variáveis em `tokens.css`, então mudar uma cor é mudar um lugar só.
- **Reaproveitamento em vez de repetição.** Os três carrosséis de produtos usam o mesmo `initCarousel` e o mesmo `createProductCard`; o carrossel de redes sociais também usa o `initCarousel` (por isso as bolinhas são opcionais no módulo). Todas as seções com título usam a mesma classe `.section`.
- **Estado separado da interface.** O `cart.js` não toca no DOM. Isso permite testá-lo sozinho e trocar a interface sem mexer na regra.

### Onde o Figma não deixava claro

- **Hover do card de produto:** o botão "Comprar" e as etiquetas "CUPOM COM 15%OFF" e "DIA DO CONSUMIDOR" aparecem no hover **e** no foco por teclado. Em telas de toque (sem hover) ficam sempre visíveis, para não esconder a ação principal.
- **Contador:** o Figma mostra números estáticos. Usei uma **data final fixa (31/12/2026, 23h59 de Brasília)**, de modo que o contador é real e não reinicia a cada visita. Ao chegar a zero ele para em `00`.
- **Dados dos produtos:** são demonstrativos (`products.js`), como o enunciado permite. Ficam num arquivo separado dos componentes, então trocar por uma API é mudar só a origem dos dados.
- **Banners com texto dentro da imagem:** o banner inteiro é um link, e o `alt` repete o texto da arte, para quem usa leitor de tela.
- **Setas do menu ("Perfumaria ▾" etc.):** mantive no desktop como no Figma, mas não há submenus desenhados, então os itens levam a `#`.
- **Footer:** implementei a variante "Footer-com-news" do componente, que é a usada na Home.
- **Frete grátis:** a barra de anúncio diz "acima de R$ 199,90" e o bloco de benefícios diz "acima de R$ 145,90". Como o Figma se contradiz, usei **R$ 199,90** (o da barra de anúncio, mais visível) no mini cart. O valor é uma constante no topo de `mini-cart.js`.

### Carrinho e mini cart

- O mini cart é um `<dialog>` nativo aberto com `showModal()`. Com isso o foco fica preso dentro do carrinho, o ESC fecha, o fundo fica inerte e o foco volta ao botão de origem, sem biblioteca e sem JavaScript extra.
- O subtotal é calculado **em centavos**, para evitar erros de ponto flutuante (`0.1 + 0.2`). A quantidade máxima por item é 99.
- O carrinho é salvo no `localStorage`. Se o armazenamento estiver indisponível (modo privado) ou o dado salvo estiver corrompido, ele ignora e continua funcionando em memória.
- O selo da sacola, que no layout aparecia fixo em "3", agora mostra a quantidade real, some quando o carrinho está vazio e vira "99+" acima de 99.
- O Figma não traz o desenho do carrinho, então o visual é meu, usando as cores e fontes do projeto. O botão "Finalizar compra" avisa que o checkout está fora do escopo do teste.
- **Newsletter:** a validação é só no navegador e o cadastro só exibe a confirmação, pois não há back-end neste teste.

### Responsividade (o Figma só tem desktop)

Fiz o CSS partindo do desktop (como o layout) e adaptando para baixo.

| Largura | O que muda |
|---|---|
| abaixo de 1200px | footer passa de 4 para 2 colunas |
| abaixo de 1100px | header compacto: hambúrguer, ícones e busca em linha própria; o menu vira drawer lateral |
| abaixo de 1024px | bloco de redes sociais empilha, benefícios quebram linha, cronograma capilar em 2 colunas |
| abaixo de 768px | coluna única, setas dos carrosséis somem (arrasta-se com o dedo), barra de anúncio quebra linha |

- O menu horizontal tem 7 itens e só cabe a partir de ~1100px, por isso o header compacto começa aí e não nos 1024px "tradicionais".
- Hero e banners usam as mesmas imagens do desktop, só redimensionadas, porque o Figma não tem arte mobile.
- Blog e causas usam `grid-template-columns: repeat(auto-fit, ...)`, e o número de colunas se ajusta sozinho.

### Acessibilidade

- Landmarks (`header`, `nav`, `main`, `footer`), seções ligadas ao título por `aria-labelledby` e hierarquia de títulos (`h1` oculto visualmente, `h2` por seção, `h3` dentro de cards).
- Texto alternativo em todas as imagens de conteúdo; ícones decorativos com `alt=""`.
- Inputs com `<label>` (ocultos visualmente quando há placeholder) e mensagens do formulário em região `aria-live`.
- Navegação por teclado: indicador de foco visível, link "Pular para o conteúdo", menu mobile com o resto da página inerte enquanto aberto, ESC fecha menu e carrinho.
- `prefers-reduced-motion` desliga as animações para quem pediu menos movimento.

### Performance

- **Lighthouse (PageSpeed Insights):** Celular — Desempenho 96, Acessibilidade 93, Boas práticas 100, SEO 100. Computador — Desempenho 100, Acessibilidade 93, Boas práticas 100, SEO 100.

- Fotos em WebP e ícones/logos em SVG; imagens abaixo da dobra com `loading="lazy"` e todas com `width` e `height` para não causar deslocamento de layout.
- A imagem do hero (a mais importante) usa `fetchpriority="high"`.
- Fontes com `preconnect` e `display=swap`; nenhuma biblioteca JavaScript.


### Git

- Uma branch por funcionalidade (`feat/...`, `fix/...`, `docs/...`), unidas na `main`.
- Commits pequenos, no padrão Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`).

## Testes

```bash
npm test
```

São 11 testes automatizados da lógica do carrinho (`tests/cart.test.js`), feitos com o test runner nativo do Node: somar quantidade do mesmo produto, subtotal em centavos, limite de 99 por item, remoção, persistência, recuperação de dados corrompidos, funcionamento sem `localStorage` e notificação de quem assina o estado.

## O que eu faria com mais tempo

- **Medir e ajustar o Lighthouse**, com imagens responsivas (`srcset`/`sizes`) e AVIF, e fontes hospedadas junto do projeto.
- **Testes de ponta a ponta** (Playwright) para o fluxo comprar → abrir mini cart → alterar quantidade → recarregar, e uma checagem automática de acessibilidade (axe).
- **Comparação visual com o Figma** (screenshot lado a lado) para chegar mais perto do pixel-perfect nos espaçamentos e textos.
- **Funcionalidades hoje só visuais:** busca, favoritos (persistidos), submenus do menu e login.
- **Carrinho mais completo:** sincronizar entre abas abertas (evento `storage`), cálculo de frete por CEP e um checkout.
- **Dados reais:** consumir os produtos de uma API e montar o HTML dos cards com `createElement`/`<template>` em vez de `innerHTML`, eliminando qualquer risco de injeção.
- **Menos repetição no HTML:** o bloco do carrossel de produtos aparece três vezes, e poderia virar um componente (Web Component ou gerado por JS).
- **Arte mobile** para hero e banners, em vez de reduzir a imagem do desktop.
- **TypeScript** para tipar o produto e o estado do carrinho.
- **Build com Vite** para minificar CSS e JavaScript e versionar os arquivos estáticos.

## Uso de IA

Foi usado o Claude como apoio durante o desenvolvimento (revisão de código, ideias de organização e testes). 