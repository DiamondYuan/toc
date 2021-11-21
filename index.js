const fs = require("fs/promises");
const path = require("path");

const spaceRegex =
  /^[\t\n\v\f\r \u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000]*/;

function format(bookToc) {
  const lines = bookToc.split("\n").map((p) => p.trimEnd());
  const res = [];
  let space;
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(spaceRegex);
    if (match && match[0]) {
      space = match[0];
      break;
    }
  }
  for (let i = 0; i < lines.length; i++) {
    let current = lines[i];
    let spaceHeader = "";
    while (current.slice(0, space.length) === space) {
      current = current.replace(space, "");
      spaceHeader = spaceHeader + "    ";
    }
    lines[i] = `${spaceHeader}${current}`;
  }
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
