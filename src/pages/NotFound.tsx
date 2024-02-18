import { Link } from "react-router-dom";
import Route from "../enum/Route";

const NotFound = () => {
  return (
    <>
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <div className="flexGrow">
        <Link to={Route.HOME}>Visit Our Homepage</Link>
      </div>
    </>
  )
}

export default NotFound
