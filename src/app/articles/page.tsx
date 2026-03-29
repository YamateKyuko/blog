const baseurl = process.env.GH_BASURL;

export default async function Page() {
  return (
    <main>
      <nav className="kuzu">
        <a href={`${baseurl}`}>top</a>
        <a href={`${baseurl}articles/`}>articles</a>
      </nav>
      <h1>Yamakyu.Log Markdown root</h1>
    </main>
  )
}