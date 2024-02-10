import NavBar from "./NavBar";
import { Outlet, useNavigation } from "react-router-dom";
import Spinner from "./Spinner";

export default function Layout() {
  const navigation = useNavigation();

  return (
    <div className="min-h-full">
      <NavBar/>
      <main>
        <div className="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
          {navigation.state === "loading" ? <Spinner/> : <Outlet/>}
        </div>
      </main>
    </div>
  )
};