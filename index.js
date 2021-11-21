const fs = require("fs/promises");
const path = require("path");

function format(bookToc) {
  const lines = bookToc.split("\n").map((p) => p.trimEnd());
  const res = [];
  for (const iterator of lines) {
    for (let i = iterator.length - 1; i >= 0; i--) {
      if (iterator[i] === " ") {
        res.push(
          `${iterator.slice(0, i).trimEnd()} ${iterator.slice(i).trim()}`
        );
        break;
      }
    }
  }
  return res.join("\n");
}

(async () => {
  const booksDir = path.join(__dirname, "books");
  const books = await (
    await fs.readdir(booksDir)
  ).filter((o) => o.endsWith(".txt"));

  for (const book of books) {
    const bookPath = path.join(booksDir, book);
    const original = await fs.readFile(bookPath, "utf8");
    const newBookToc = format(original);
    await fs.writeFile(bookPath, newBookToc);
  }
})();
