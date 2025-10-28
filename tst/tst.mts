// ...existing code...
import { Octokit } from "octokit";
import dotenv from "dotenv";
import unzipper from "unzipper";
import fs from "fs";
import path from "path";

dotenv.config({ path: `${process.cwd()}/../.env.development`, quiet: true });

async function main() {
  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_API_KEY });

    const resp = await octokit.request("GET /repos/{owner}/{repo}/zipball/{ref}/", {
      owner: process.env.GITHUB_USERNAME,
      repo: process.env.GITHUB_REPO_NAME,
      ref: "main",
      request: { responseType: "stream" }
    });

    const dest = path.resolve(process.cwd(), "tmp");

    // 再作成
    await fs.promises.rm(dest, { recursive: true, force: true });
    await fs.promises.mkdir(dest, { recursive: true });

    const data = resp.data as ArrayBuffer;
    const buffer = Buffer.from(data);
    const directory = await unzipper.Open.buffer(buffer);
    await directory.extract({ path: dest });

    // 展開が終わったことを保証してからファイル走査
    const tmpcontents = await fs.promises.readdir(dest);
    const headerFilename = tmpcontents[0];
    const articlesDir = path.join(dest, headerFilename, "blog", "articles");

    const res = await scanFile(articlesDir, "md");
    console.log("res:", res);

  } catch (err) {
    console.log("err:", err);
  }
}

async function scanFile(dirpath: string, fileExt: 'md'): Promise<string[]> {
  const paths: string[] = [];
  const scanner = async (dir: string) => {
    // const paths: string[] = [];
    const contents = await fs.promises.readdir(`${dirpath}/${dir}`, { withFileTypes: true });
    const r = contents.map(async (item): Promise<void> => {
      if (item.isDirectory()) {
        await scanner(`${dir}/${item.name}`)
      }
      else if (
        item.isFile() &&
        item.name.endsWith(`.${fileExt}`)
      ) {
        console.log("found file:", item.name);
        paths.push(`${dir}/${item.name}`)
      };
    });
    await Promise.all(r);
  }

  await scanner('');
  

  return paths;

}


main();