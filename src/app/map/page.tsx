import { MetadataRoute } from "next";
import { generateStaticParams } from "../articles/[...slug]/page";

export const dynamic = 'force-static';

const baseurl = process.env.GH_BASEURL || '';

export default async function Page() {
  const slugs = await generateStaticParams();
  const date = new Date();

  return (
    <main>
      <nav className="kuzu">
        <a href={`${baseurl}`}>top</a>
        <a href={`${baseurl}map/`}>map</a>
      </nav>
      <h2>
        <a href={`${baseurl}articles`}>{`articles`}</a>
      </h2>
      {slugs.map((v, i) => {return (
        <p key={i}>
          <a href={`${baseurl}articles/${v.slug.join('/')}`}>{`articles/${v.slug.join('/')}`}</a>
          
        </p>
      )})}
    </main>
  )
}
// <>{`${baseurl}articles/${v.slug.join('/')}`}</>