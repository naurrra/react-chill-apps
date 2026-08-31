// Home.jsx

function Home({ heroMovie, sections, onWatch }) {
  return (
    <React.Fragment>
      <Hero movie={heroMovie} onWatch={onWatch} />

      {sections.map((section) => (
        <ContentSection
          key={section.key}
          title={section.title}
          movies={section.movies}
          variant={section.variant}
        />
      ))}
    </React.Fragment>
  );
}
