export default function Head() {
  const site = {
    name: "CineLenz",
    url: "https://cinelenz.example.com/get-started",
    description: "Discover movies with aggregated reviews and CineLenz ratings from critics and audiences.",
  }
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CineLenz',
    url: site.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site.url}?title={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <>
      <title>Get Started • CineLenz</title>
      <meta name="description" content={site.description} />
      <meta property="og:title" content="CineLenz – Discover Movies" />
      <meta property="og:description" content={site.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={site.url} />
      <meta property="og:image" content="/og-default.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="CineLenz – Discover Movies" />
      <meta name="twitter:description" content={site.description} />
      <meta name="twitter:image" content="/og-default.png" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
