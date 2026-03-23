import { Octokit } from "octokit";
import path from "path";
import fs from "fs";
import unzipper from "unzipper";
import { unified } from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";

export class Articles {

  path: string;
  articlesDirName: string;
  contents: Map<string, Article>;

  private constructor(dest: string, articlesDirName: string, contents: Map<string, Article>) {
    this.path = dest;
    this.articlesDirName = articlesDirName;
    this.contents = contents;
  };

  static async get(dest: string) {
    
    await this.loadZip(dest);
    const articlesDirName = await this.getArticlesDirName(dest);
    const contents = await this.getArticles(dest, articlesDirName, 'md');
    const cls = new Articles(
      dest,
      articlesDirName,
      contents
    );
    return cls;
  }

  private static async loadZip(dest: string) {
    try {
      const {
        GH_API_KEY: apikey,
        GH_USERNAME: username,
        GH_REPO_NAME: reponame
      } = process.env;

      if (!apikey || !username || !reponame) {throw new Error('Missing Secrets');}
      
      const octokit = new Octokit({ auth: apikey });
      const resp = await octokit.request("GET /repos/{owner}/{repo}/zipball/{ref}/", {
        owner: username,
        repo: reponame,
        ref: "main",
        request: { responseType: "stream" }
      });

      await fs.promises.rm(dest, { recursive: true, force: true });
      await fs.promises.mkdir(dest, { recursive: true });

      const data = await resp.data as ArrayBuffer;
      const buffer = Buffer.from(data);
      const directory = await unzipper.Open.buffer(buffer);
      await directory.extract({ path: dest });
    } catch (err) {
      console.log("err:", err);
    }
  };

  private static async getArticlesDirName(dest: string) {
    const tmpcontents = await fs.promises.readdir(dest);
    const headerFilename = tmpcontents[0];
    return headerFilename;
  }

  private static async getArticles(dest: string, articlesDirName: string, fileExt: string) {
    // const paths: string[] = [];
    try {
      const articles: Map<string, Article> = new Map();
      const scanner = async (currdir: string[]) => {
        const dire = `${dest}/${articlesDirName}/blog/articles/${currdir.join('/')}`;
        const contents = await fs.promises.readdir(dire, { withFileTypes: true });
        await Promise.all(contents.map(async (item): Promise<void> => {
          if (item.isDirectory()) {
            await scanner([...currdir, item.name]);
          }
          else if (
            item.isFile() &&
            item.name.endsWith(`.${fileExt}`)
          ) {
            if (item.name.startsWith(`_`)) return;
            // paths.push([...dir, item.name].join('/'));
            const filepath = [...currdir, item.name].join('/');
            const article = await Article.get(dire, item.name, 'md');
            articles.set(filepath, article);
          };
        }));
      }
      await scanner([]);

      return articles;
    } catch (err) {
      console.log("err:", err);
      return new Map();
    }
  }
};

export class Article {
  filepath: string;
  parepath: string;
  fullpath: string;
  fileExt: 'md';

  private constructor(parepath: string, filepath: string, fileExt: 'md') {
    this.parepath = parepath;
    this.filepath = filepath;
    this.fullpath = path.join(this.parepath, this.filepath);
    this.fileExt = fileExt;
  }

  static async get(parepath: string, filepath: string, fileExt: 'md') {
    return new Article(parepath, filepath, fileExt);
  }

  async getHTML() {
    const d = await fs.promises.readFile(`${this.fullpath}`, 'utf-8')
    const processor = unified()
      .use(markdown)
      .use(remark2rehype)
      .use(html);
    const h = await processor.process(d);
    return h.toString();
  }
}