import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage({
  message = "The page you are looking for does not exist.",
}) {
  return (
    <div className="page page--not-found">
      <div className="container">
        <h1 className="page__title">Page not found</h1>
        <p className="page__lead">{message}</p>
        <Link to="/" className="not-found__link">
          Back to shop
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
