export const dynamic = 'force-static';
export const dynamicParams = false;

import { Articles } from "./class";

const dest = `${process.cwd()}/tmp`;

const articles = await Articles.get(dest);

export async function generateStaticParams() {
  const articlepaths = articles.contents.keys();
  const slugs = articlepaths.map((path) => {
    console.log("path:", path);
    return {slug: path.split('/')};
  })
  return [...slugs];
}

export default async function Page(props: PageProps<'/articles/[...slug]'>) {
  const { slug } = await props.params;
  const article = articles.contents.get(slug.join('/'));
  if (!article) {
    throw new Error('Article not found');
  }
  const html = await article.getHTML();
  return (
    <main>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}