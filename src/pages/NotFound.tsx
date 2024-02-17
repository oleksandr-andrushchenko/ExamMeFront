import { Link } from "react-router-dom";
import RoutePath from "../schema/RoutePath";

const NotFound = () => {
  return (
    <>
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <div className="flexGrow">
        <Link to={RoutePath.HOME}>Visit Our Homepage</Link>
      </div>
    </>
  )
}

export default NotFound
