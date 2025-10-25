export const dynamic = 'force-static'

export async function generateStaticParams() {
  const list = await fetch('https://api.example.com/articles/list').then(r => r.json())
  return list.map((a: { slug: string }) => ({ slug: a.slug.split('/') }))
}

type Props = { params: { slug?: string[] } }

export default async function Page({ params }: Props) {
    const slugArray = params.slug ?? []
    const slugPath = slugArray.join('/') // 'foo/bar' のようなパス

    // APIから記事を取得（SSRで毎回フェッチ）
    const res = await fetch(`https://api.example.com/articles/${encodeURIComponent(slugPath)}`, {
        cache: 'no-store' // SSRで常に最新を取る
    })
    // if (!res.ok) return notFound()
    const article = await res.json()

    return (
        <main>
            <h1>{article.title}</h1>
            <article dangerouslySetInnerHTML={{ __html: article.html }} />
        </main>
    )
}