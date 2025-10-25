// ...existing code...
import { Octokit } from "octokit";
import dotenv from "dotenv";
import { pipeline } from "stream/promises";
import unzipper from "unzipper";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

dotenv.config({ path: `${process.env.PWD}/../.env.development` });

const octokit = new Octokit({ auth: process.env.GITHUB_API_KEY });

const resp = await octokit.request("GET /repos/{owner}/{repo}/zipball/{ref}", {
  owner: process.env.GITHUB_USERNAME,
  repo: process.env.GITHUB_REPO_NAME,
  ref: "main",
  request: { responseType: "stream" }
});

// console.log(resp);

function filenameFromContentDisposition(header) {
  if (!header) return null;
  const m = /(?<=filename\=)(.*)(?=\.zip)/i.exec(header);
  console.log(m);
  // return m;
  return m ? decodeURIComponent(m[1]) : null;
}
const contentDisp = resp.headers && (resp.headers['content-disposition'] || resp.headers['Content-Disposition']);
const headerFilename = filenameFromContentDisposition(contentDisp);
console.log("headerFilename:", headerFilename);

const dest = path.resolve(process.cwd(), "tmp");
if (await fs.existsSync(dest)) {
  await fs.promises.rm(dest, { recursive: true });
};
await fs.promises.mkdir(dest, { recursive: true });

// ストリームをそのまま展開（メモリ節約）
// ArrayBuffer -> Buffer -> Readable にして展開
const buffer = Buffer.from(resp.data);
await pipeline(Readable.from(buffer), unzipper.Extract({ path: dest }));

console.log("extracted to", dest);
// ...existing code...




const searchFiles = (dirPath) => {
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

  const files = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const fp = path.join(dirPath, dirent.name);
      files.push(searchFiles(fp));
    } else if (dirent.isFile() && ['.md'].includes(path.extname(dirent.name))) {
      files.push({
        dir: path.join(dirPath, dirent.name),
        name: dirent.name,
      });
    }
  }
  return files.flat();
};

const dirPath = `${dest}/${headerFilename}`;
console.log("searching files in", dirPath);
console.log(searchFiles(dirPath));