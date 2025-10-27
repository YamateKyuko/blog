// ...existing code...
import { Octokit } from "octokit";
import dotenv from "dotenv";
import { pipeline } from "stream/promises";
import unzipper from "unzipper";
import fs from "fs";
import path from "path";
import { Readable } from "stream";

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

const dest = await path.resolve(process.cwd(), "tmp");
const isDestExists = await fs.promises.stat(dest);
if (isDestExists) {
  await fs.promises.rm(dest, { recursive: true });
};
await fs.promises.mkdir(dest, { recursive: true });

const buffer = Buffer.from(resp.data);
await pipeline(Readable.from(buffer), unzipper.Extract({ path: dest }));

} catch (err) {
  console.log("err:", err);
}



// const searchFiles = (dirPath) => {
//   const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

//   const files = [];
//   for (const dirent of allDirents) {
//     if (dirent.isDirectory()) {
//       const fp = path.join(dirPath, dirent.name);
//       files.push(searchFiles(fp));
//     } else if (dirent.isFile() && ['.md'].includes(path.extname(dirent.name))) {
//       files.push({
//         dir: path.join(dirPath, dirent.name),
//         name: dirent.name,
//       });
//     }
//   }
//   return files.flat();
// };

// const dirPath = `${dest}/${headerFilename}`;
// console.log("searching files in", dirPath);
// console.log(searchFiles(dirPath));

// console.log('reading articles in', `${process.cwd()}/tmp/${headerFilename}/blog/articles`);
const a = await fs.promises.readdir(`${process.cwd()}/tmp/${headerFilename}/blog/articles`, {withFileTypes: true})
console.log(a)
// fs.readdir(`${process.cwd()}/tmp/${headerFilename}/blog/articles`, function(err, files){
// 	if (err) throw err;
// 	var fileList = files.filter(function(file){
// 		return fs.statSync(file).isFile() && /.*\.md$/.test(file); //絞り込み
// 	})
// 	console.log('f', fileList);
// });

}

main();