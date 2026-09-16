// Home.jsx
import { Fragment } from "react";
import Hero from "../components/Hero.jsx";
import ContentSection from "../components/ContentSection.jsx";

function Home({ heroMovie, sections, onWatch }) {
  return (
    <Fragment>
      <Hero movie={heroMovie} onWatch={onWatch} />

      {sections.map((section) => (
        <ContentSection
          key={section.key}
          title={section.title}
          movies={section.movies}
          variant={section.variant}
        />
      ))}
    </Fragment>
  );
}

export default Home;