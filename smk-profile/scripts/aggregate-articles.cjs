const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const directory = path.join(root, "data", "kabar-sekolah");
const files = fs.readdirSync(directory).filter((file) => file.endsWith(".json")).sort();
const slugs = new Set();

const articles = files.map((file) => {
  const article = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
  const slug = path.basename(file, ".json")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  if (!slug || slugs.has(slug)) throw new Error(`Slug artikel tidak unik: ${file}`);
  slugs.add(slug);
  return { ...article, id: article.id || slug, slug };
});

fs.writeFileSync(
  path.join(root, "data", "kabar-articles.json"),
  `${JSON.stringify({ articles }, null, 2)}\n`
);
