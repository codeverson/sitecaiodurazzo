# Caio Durazzo

Site oficial de Caio Durazzo desenvolvido com React, TypeScript, Vite e Tailwind CSS. O projeto reúne direção visual editorial, home institucional, agenda, discografia interativa, ferramentas musicais nativas, painel de administração local e uma página dedicada ao projeto `Crazy Legs`.

Repositório: [github.com/codeverson/sitecaiodurazzo](https://github.com/codeverson/sitecaiodurazzo)

## Visão geral

O site foi estruturado como uma aplicação front-end com múltiplas rotas renderizadas no cliente:

- `/`: home principal com hero, manifesto, YouTube, agenda, discografia e contratação
- `/crazy-legs`: página editorial dedicada ao projeto Crazy Legs
- `/aulas`: página de aulas
- `/staff`: painel administrativo com login e edição local de conteúdo

## Recursos do projeto

- Home com composição editorial e foco institucional
- Discografia com carrossel interativo
- Agenda e conteúdo de YouTube gerenciáveis
- Painel `/staff` para editar hero, vídeos, agenda e discografia
- Persistência local via `localStorage`
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

- O painel `/staff` usa persistência local no navegador para edição de conteúdo, sem backend.
- Parte do conteúdo administrativo, como hero, agenda, vídeos e discografia, pode ser sobrescrita localmente.
- O projeto inclui materiais legados em `v1` e `v2`, além da implementação React atual em `src/`.
