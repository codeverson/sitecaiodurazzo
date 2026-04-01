# Caio Durazzo

Site oficial de Caio Durazzo desenvolvido com React, TypeScript, Vite e Tailwind CSS. O projeto reúne direção visual editorial, home institucional, agenda, discografia interativa, ferramentas musicais nativas, painel de administração com Firebase e uma página dedicada ao projeto `Crazy Legs`.

Repositório: [github.com/codeverson/sitecaiodurazzo](https://github.com/codeverson/sitecaiodurazzo)

## Visão geral

O site foi estruturado como uma aplicação front-end com múltiplas rotas renderizadas no cliente:

- `/`: home principal com hero, manifesto, YouTube, agenda, discografia e contratação
- `/crazy-legs`: página editorial dedicada ao projeto Crazy Legs
- `/aulas`: página de aulas
- `/staff`: painel administrativo Backstage com login e edição local de conteúdo

## Recursos do projeto

- Home com composição editorial e foco institucional
- Discografia com carrossel interativo
- Agenda e conteúdo de YouTube gerenciáveis
- Painel `/staff` (Backstage) com Firebase Authentication
- Persistência remota via Firestore e upload de imagens no Firebase Storage
- Ferramentas nativas para fretboard e tab maker
- Página especial para `Crazy Legs` com hero, texto institucional, colagem, discografia filtrada e fechamento editorial

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- PostCSS

## Scripts

Instalação:

```bash
npm install
```

Desenvolvimento:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
```

Preview local da build:

```bash
npm run preview
```

## Firebase

Crie um arquivo `.env` a partir de `.env.example` e preencha as credenciais da app web do projeto Firebase `caiodurazzo`.

```bash
cp .env.example .env
```

Variáveis necessárias:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_ADMIN_EMAILS` opcional, para restringir o `/staff` (Backstage) a e-mails específicos. O padrão atual do projeto é `araujo3ve@gmail.com,caiorocker@gmail.com`

Para o `/staff` (Backstage), ative o provedor `Google` no Firebase Authentication e use uma das contas liberadas.

Arquivos auxiliares incluídos no projeto:

- `firestore.rules`
- `public/.htaccess` para fallback da SPA na Hostinger
- `public/upload-image.php` para upload autenticado de imagens na Hostinger
- `public/spotify-oembed.php` para resolver automaticamente capas do Spotify em produção

## Publicação na Hostinger

1. Preencha o `.env` com as credenciais do Firebase.
2. Gere a build com `npm run build`.
3. Envie o conteúdo de `dist/` para a hospedagem estática da Hostinger.
4. Garanta que o arquivo `.htaccess` gerado na build esteja publicado para o fallback das rotas `/staff`, `/aulas` e `/crazy-legs`.
5. Garanta que os arquivos `upload-image.php` e `spotify-oembed.php` também estejam publicados na raiz do site junto com a pasta `uploads/`.
6. No Firebase Authentication, habilite `Google` como provedor e confirme que o domínio publicado está em `Authorized domains`.
7. No primeiro acesso ao `/staff`, entre com Google usando um e-mail admin liberado para o Backstage, use o botão de carga inicial para semear Firestore se o banco estiver vazio e envie imagens direto pelo seletor de arquivos.

## Estrutura

- `src/components`: seções da home, páginas, componentes visuais e painéis de admin
- `src/components/tools`: ferramentas musicais nativas
- `src/context`: estado e persistência local para hero, agenda, vídeos e discografia
- `src/data`: textos, links, dados editoriais e conteúdo base
- `src/lib`: utilitários, música, áudio e integrações auxiliares
- `src/styles`: estilos globais e utilitários Tailwind
- `assets`: imagens, texturas e materiais visuais do projeto
- `public`: arquivos públicos e diretórios auxiliares

## Observações

- O painel `/staff` (Backstage) agora depende do Firebase Authentication com login via Google.
- Hero, agenda, vídeos e discografia são lidos do Firestore; imagens de hero e discografia podem ser enviadas direto para a Hostinger via `upload-image.php`.
- As capas da discografia com link válido do Spotify são resolvidas automaticamente e ficam em cache no navegador após a primeira busca.
- SEO técnico e discoverability agora incluem `robots.txt`, `sitemap.xml`, `llms.txt` e uma camada central de metadados por rota.
- Checklist pós-publicação para Search Console e Bing: `docs/seo-post-launch-checklist.md`.
- O projeto inclui materiais legados em `v1` e `v2`, além da implementação React atual em `src/`.
