# SEO Post-Launch Checklist

## Publicacao

- Confirmar que `robots.txt`, `sitemap.xml` e `llms.txt` foram publicados na raiz de `https://caiodurazzo.com`.
- Confirmar que `https://caiodurazzo.com/robots.txt` referencia `https://caiodurazzo.com/sitemap.xml`.
- Confirmar que `/staff` continua acessivel para administracao, mas sem indexacao publica.

## Search Console e Bing

- Adicionar e validar a propriedade `https://caiodurazzo.com/` no Google Search Console.
- Adicionar e validar a propriedade do dominio no Bing Webmaster Tools.
- Enviar o sitemap em ambas as plataformas.
- Solicitar reindexacao das paginas principais: `/`, `/aulas` e `/crazy-legs`.
- Monitorar cobertura, canonicals escolhidas, paginas excluidas e alertas de dados estruturados.

## Validacao tecnica

- Testar manualmente `view-source:` e inspecao do DOM renderizado nas rotas principais.
- Validar `BreadcrumbList`, `FAQPage`, `MusicGroup`, `MusicEvent`, `MusicAlbum` e `VideoObject` no validador de Schema.
- Conferir compartilhamento social das rotas principais com Open Graph e Twitter Card.

## Limites atuais da arquitetura

- O projeto continua sendo uma SPA em Vite com metadados por rota aplicados no cliente.
- Buscadores modernos tendem a processar essas tags apos renderizacao, mas `view-source` ainda entrega o HTML base da SPA.
- Se quiser metadados HTML unicos ja na resposta inicial de cada rota, o proximo passo estrutural e adicionar prerender/SSR ou gerar entradas HTML por rota publica.

## Melhorias recomendadas depois do deploy

- Otimizar imagens editoriais muito pesadas, especialmente arquivos acima de 1 MB usados no front.
- Avaliar code-splitting das rotas para reduzir o bundle inicial.
- Se as ferramentas musicais forem tornar-se paginas publicas, criar rotas dedicadas, metadados proprios e inclui-las no sitemap.
