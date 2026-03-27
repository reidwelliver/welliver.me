import { Link, Navigate, useParams } from "react-router";
import { Content } from "@welliver-me/ui/components/Content";
import { getContentTitle } from "@welliver-me/ui/components/Content/config";
import { slugToHref } from "@welliver-me/ui/config/routes";
import "./MobileArticle.css";
import "../Content/Content.css";

export function MobileArticle() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/" replace />;

  const href = slugToHref(slug);
  const title = getContentTitle(href);

  if (!title) return <Navigate to="/" replace />;

  return (
    <div className="mobile-article">
      <Link className="mobile-article__back" to="/">
        &larr; Back
      </Link>
      <div className="mobile-article__panel">
        <h2 className="mobile-article__title">{title}</h2>
        <Content href={href} />
      </div>
    </div>
  );
}
