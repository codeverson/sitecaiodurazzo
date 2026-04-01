import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PROJECT_ROOT = process.cwd();
const DIST_DIR = path.join(PROJECT_ROOT, "dist");
const MANIFEST_PATH = path.join(DIST_DIR, ".vite", "manifest.json");
const BASE_HTML_PATH = path.join(DIST_DIR, "index.html");
const ROUTES_PATH = path.join(PROJECT_ROOT, "src", "data", "seoRoutes.json");
const SITE_URL = "https://caiodurazzo.com";
const DEFAULT_ROBOTS = "index, follow, max-image-preview:large";

const PRERENDER_ROUTES = [
  { key: "home", outputPath: path.join(DIST_DIR, "index.html") },
  { key: "aulas", outputPath: path.join(DIST_DIR, "aulas", "index.html") },
  { key: "crazy-legs", outputPath: path.join(DIST_DIR, "crazy-legs", "index.html") },
  { key: "maintenance", outputPath: path.join(DIST_DIR, "maintenance", "index.html") },
];

function asAbsoluteUrl(pathOrUrl) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, SITE_URL).toString();
}

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
}

function upsertMetaByName(html, name, content) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta\\s+[^>]*name=["']${escapedName}["'][^>]*>`, "i");
  const tag = `<meta name="${name}" content="${content}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function upsertMetaByProperty(html, property, content) {
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta\\s+[^>]*property=["']${escapedProperty}["'][^>]*>`, "i");
  const tag = `<meta property="${property}" content="${content}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function upsertCanonical(html, href) {
  const pattern = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;
  const tag = `<link rel="canonical" href="${href}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function resolveAssetUrl(manifest, sourcePath) {
  for (const [key, value] of Object.entries(manifest)) {
    if (!value || typeof value !== "object" || !("file" in value)) continue;
    if (key === sourcePath || key.endsWith(sourcePath) || value.src === sourcePath) {
      return `/${value.file}`;
    }
  }

  throw new Error(`Nao foi possivel localizar a imagem "${sourcePath}" no manifest do build.`);
}

function renderRouteHtml(baseHtml, route, ogImageUrl) {
  const canonicalUrl = asAbsoluteUrl(route.canonicalPath);

  let html = replaceTitle(baseHtml, route.title);
  html = upsertMetaByName(html, "description", route.description);
  html = upsertMetaByName(html, "robots", route.robots ?? DEFAULT_ROBOTS);
  html = upsertCanonical(html, canonicalUrl);
  html = upsertMetaByProperty(html, "og:locale", "pt_BR");
  html = upsertMetaByProperty(html, "og:type", route.ogType ?? "website");
  html = upsertMetaByProperty(html, "og:site_name", "Caio Durazzo");
  html = upsertMetaByProperty(html, "og:title", route.title);
  html = upsertMetaByProperty(html, "og:description", route.description);
  html = upsertMetaByProperty(html, "og:url", canonicalUrl);
  html = upsertMetaByProperty(html, "og:image", ogImageUrl);
  html = upsertMetaByName(html, "twitter:card", "summary_large_image");
  html = upsertMetaByName(html, "twitter:title", route.title);
  html = upsertMetaByName(html, "twitter:description", route.description);
  html = upsertMetaByName(html, "twitter:image", ogImageUrl);

  return html;
}

const [baseHtml, manifestRaw, routesRaw] = await Promise.all([
  readFile(BASE_HTML_PATH, "utf8"),
  readFile(MANIFEST_PATH, "utf8"),
  readFile(ROUTES_PATH, "utf8"),
]);

const manifest = JSON.parse(manifestRaw);
const routes = JSON.parse(routesRaw);

for (const routeEntry of PRERENDER_ROUTES) {
  const route = routes[routeEntry.key];

  if (!route) {
    throw new Error(`Rota de SEO "${routeEntry.key}" nao encontrada em seoRoutes.json.`);
  }

  const ogImageUrl = asAbsoluteUrl(resolveAssetUrl(manifest, route.ogImageSource));
  const html = renderRouteHtml(baseHtml, route, ogImageUrl);

  await mkdir(path.dirname(routeEntry.outputPath), { recursive: true });
  await writeFile(routeEntry.outputPath, html, "utf8");
}
