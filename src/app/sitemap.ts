export const dynamic = "force-static"

import { MetadataRoute } from 'next'
import { generateStaticParams } from './articles/[...slug]/page';

// const baseurl = 'https://yamatekyuko.github.io/blog/articles/'; // 要修正
const baseurl = process.env.GH_BASEURL || ''

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {


  const slugs = await generateStaticParams();
  const date = new Date();

  // const articlepaths = articles.contents.keys();
  // const slugs: {slug: string[]}[] = [];
  // for (const path of articlepaths) {
  //   console.log("path:", path);
  //   slugs.push({slug: path.split('/')});
  // }

  return slugs.map((v): MetadataRoute.Sitemap[number] => {
    return {
      url: `${baseurl}articles/${v.slug.join('/')}`,
      lastModified: date,
      changeFrequency: 'never',
    }
  });
};