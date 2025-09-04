import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Objects", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const SideBar = ({ sideBar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`
        w-60 bg-white border-r border-gray-200 flex flex-col justify-between 
        max-sm:fixed max-sm:top-14 max-sm:bottom-0 max-sm:z-50
        transition-transform duration-300 ease-in-out
         ${
           sideBar
             ? "max-sm:translate-x-0 max-sm:flex"
             : "max-sm:-translate-x-full max-sm:hidden"
         } 
    max-sm:fixed max-sm:top-14 max-sm:bottom-0 max-sm:z-50
      `}
    >
      {/* User Info */}
      <div className="my-7 w-full text-center">
        {user?.imageUrl && (
          <img
            src={user.imageUrl}
            alt="user-avatar"
            className="w-16 h-16 rounded-full mx-auto object-cover"
          />
        )}
        <h1 className="mt-2 font-medium">{user?.fullName}</h1>

        <div className="px-6 mt-5 text-sm text-gray-600 font-medium">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              to={to}
              key={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded ${
                  isActive
                    ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white"
                    : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : ""}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-t-gray-200 p-4 px-7 flex items-center justify-between">
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={openUserProfile}
        >
          <img src={user.imageUrl} alt="profile" className="w-8 rounded-full" />
          <div className="">
            <h1 className="text-sm font-medium">{user.fullName}</h1>
            <p className="text-sm text-gray-500">
              <Protect plan="premium" fallback="Free">
                Premium{" "}
              </Protect>
              Plan
            </p>
          </div>
        </div>

        <LogOut
          onClick={signOut}
          className="w-4.5 text-gray-400 hover:text-gray-700 cursor-pointer transition "
        />
      </div>
    </div>
  );
};

export default SideBar;
