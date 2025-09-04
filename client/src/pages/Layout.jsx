import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import SideBar from "../components/SideBar";
import { useUser, SignIn } from "@clerk/clerk-react";

const Layout = () => {
  const navigate = useNavigate();
  const [sideBar, setSidebar] = useState(false);
  const { user } = useUser();

  return user ? (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="w-full px-6 min-h-14 flex items-center justify-between border-b border-gray-200">
        <img
          src={assets.logo}
          alt="logo"
          onClick={() => navigate("/")}
          className="w-32 sm:w-44 cursor-pointer"
        />

        {sideBar ? (
          <X
            onClick={() => setSidebar(false)}
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
          />
        ) : (
          <Menu
            onClick={() => setSidebar(true)}
            className="w-6 h-6 text-gray-600 sm:hidden cursor-pointer"
          />
        )}
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <SideBar sideBar={sideBar} setSidebar={setSidebar} />

        {/* Right content */}
        <div className="flex-1 bg-[#f4f7fb]">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
