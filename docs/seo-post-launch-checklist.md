# SEO Post-Launch Checklist

## Publicacao

- Confirmar que `robots.txt`, `sitemap.xml` e `llms.txt` foram publicados na raiz de `https://caiodurazzo.com`.
- Confirmar que `https://caiodurazzo.com/robots.txt` referencia `https://caiodurazzo.com/sitemap.xml`.
- Confirmar que os arquivos prerenderizados existem em producao para `/`, `/aulas`, `/crazy-legs` e `/maintenance`.
- Confirmar que `/staff` continua acessivel para administracao, mas sem indexacao publica.
- Confirmar que `siteContent/settings.maintenanceMode` esta em `false` antes de liberar a home para visitantes.
- Validar que admins autenticados continuam vendo o site normal mesmo quando o modo de manutencao estiver ativo.

## Search Console e Bing

- Adicionar e validar a propriedade `https://caiodurazzo.com/` no Google Search Console.
- Adicionar e validar a propriedade do dominio no Bing Webmaster Tools.
- Enviar o sitemap em ambas as plataformas.
- Solicitar reindexacao das paginas principais: `/`, `/aulas` e `/crazy-legs`.
- Monitorar cobertura, canonicals escolhidas, paginas excluidas e alertas de dados estruturados.

## Validacao tecnica

- Testar manualmente `view-source:` em `/`, `/aulas`, `/crazy-legs` e `/maintenance` para confirmar `title`, `description`, `canonical`, `og:*` e `twitter:*` sem depender de JavaScript.
- Validar `BreadcrumbList`, `FAQPage`, `MusicGroup`, `MusicEvent`, `MusicAlbum` e `VideoObject` no validador de Schema.
- Conferir compartilhamento social das rotas principais com Open Graph e Twitter Card, incluindo testes reais no WhatsApp e no X/Twitter Card Validator quando aplicavel.
- Testar upload de imagem grande no hero para confirmar o limite de 12 MB no Backstage e no endpoint `upload-image.php`.

## Limites atuais da arquitetura

- O projeto continua sendo uma SPA em Vite para navegacao no cliente, mas agora as rotas publicas principais recebem HTML inicial prerenderizado com metadados sociais.
- O prerender cobre `/`, `/aulas`, `/crazy-legs` e `/maintenance`; rotas fora dessa lista continuam usando o shell base da SPA.
- Se no futuro outras paginas publicas precisarem de preview social dedicado, elas devem entrar na camada compartilhada de SEO e no script de prerender.

## Melhorias recomendadas depois do deploy

- Otimizar imagens editoriais muito pesadas, especialmente arquivos acima de 1 MB usados no front.
- Avaliar code-splitting das rotas para reduzir o bundle inicial.
- Se as ferramentas musicais forem tornar-se paginas publicas, criar rotas dedicadas, metadados proprios e inclui-las no sitemap.
