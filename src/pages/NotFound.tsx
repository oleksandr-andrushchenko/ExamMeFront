import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <div className="flexGrow">
        <Link to="/">Visit Our Homepage</Link>
      </div>
    </>
  )
}

export default NotFound
