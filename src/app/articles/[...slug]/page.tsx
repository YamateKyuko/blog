export const dynamic = 'force-static';
export const dynamicParams = false;

import { Articles } from "./class";

const dest = `${process.cwd()}/tmp`;
const baseurl = process.env.GH_BASEURL;

const articles = await Articles.get(dest);

export async function generateStaticParams() {
  const articlepaths = articles.contents.keys();
  const slugs: {slug: string[]}[] = [];
  for (const path of articlepaths) {
    console.log("path:", path);
    slugs.push({slug: path.split('/')});
  }
  // const slugs = articlepaths.map((path) => {
  //   console.log("path:", path);
  //   return {slug: path.split('/')};
  // })
  return [...slugs];
}

export default async function Page(props: PageProps<'/articles/[...slug]'>) {
  const { slug } = await props.params;
  const article = articles.contents.get(slug.join('/'));
  if (!article) {
    console.log(`Article "${slug.join('/')}" not found;`);
    return (
      <main>
        Sorry, but article "{slug.join('/')}" not found;
        {articles.contents.keys().map((v) => <>`${v}`<br /></>)}
      </main>
    )
  }
  const html = await article.getHTML();
  const path = slug[slug.length - 1]
  console.log(slug)
  
  return (
    <main>
      <nav className="kuzu">
        <a href={`${baseurl}`}>top</a>
        <a href={`${baseurl}articles/`}>articles</a>
        {slug.map((v, i) => {
          return <a key={i} href={`${`${baseurl}articles/${slug.slice(0, i+1).join('/')}`}`}>{v}</a>
        })}
      </nav>
      
      <h1>
        {path}
      </h1>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
};