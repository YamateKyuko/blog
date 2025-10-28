import fs from "fs";
import path from "path";

async function scanFile(dirpath: string, fileExt: 'md'): Promise<string[]> {
  const paths: string[] = [];

  const scanner = async (dir: string) => {
    
    const contents = await fs.promises.readdir(`${dirpath}/${dir}`, { withFileTypes: true });
    console.log(contents);
    contents.forEach(async (item) => {
      console.log("item:", item.name);
      if (item.isDirectory()) {
        scanner(`${dir}/${item.name}`)
      }
      else if (
        item.isFile() &&
        item.name.endsWith(`.${fileExt}`)
      ) {
        paths.push(`${dir}/${item.name}`)
      };
    });
  }
  await scanner('');

  return paths;

}

async function main() {
  const dest = path.resolve(process.cwd(), "tmp");
  const tmpcontents = await fs.promises.readdir(dest);
  const headerFilename = tmpcontents[0];
  const articlesDir = path.join(dest, headerFilename, "blog", "articles");
  await scanFile(articlesDir, 'md');
} 

await main();