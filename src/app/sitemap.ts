export const dynamic = "force-static"

import { MetadataRoute } from 'next'
import { generateStaticParams } from './articles/[...slug]/page';

const baseurl = 'https://yamatekyuko.github.io/blog/' // 要修正

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
      url: `${baseurl}${v.slug.join('/')}`,
      lastModified: date,
      changeFrequency: 'never',
    }
  });



  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}