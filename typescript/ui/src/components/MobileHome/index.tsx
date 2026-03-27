import { Link } from "react-router";
import { NAV_ENTRIES } from "@welliver-me/ui/config/routes";
import "./MobileHome.css";

export function MobileHome() {
  const internal = NAV_ENTRIES.filter((e) => !e.isExternal);
  const external = NAV_ENTRIES.filter((e) => e.isExternal);

  return (
    <div className="mobile-home">
      <header className="mobile-header">
        <h1 className="mobile-header__name">Reid Welliver</h1>
        <p className="mobile-header__bio">
          A leader and innovator in software across industry including IoT and
          supply chain. I love tinkering, building things that are easy to work
          on, and tackling interesting challenges with passion.
        </p>
      </header>

      <nav className="mobile-section">
        <h2 className="mobile-section__title">Articles</h2>
        <ul className="mobile-nav">
          {internal.map((entry) => (
            <li key={entry.slug}>
              <Link className="mobile-nav__link" to={`/${entry.slug}`}>
                {entry.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="mobile-section">
        <h2 className="mobile-section__title">Links</h2>
        <ul className="mobile-nav">
          {external.map((entry) => (
            <li key={entry.slug}>
              <a
                className="mobile-nav__link mobile-nav__link--external"
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {entry.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
