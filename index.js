const fs = require("fs/promises");
const path = require("path");

function format(bookToc) {
  return bookToc;
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
