import {
  NavLink,
  Outlet,
  useNavigate
} from "react-router-dom";

import {
  History,
  Bookmark
} from "lucide-react"; 

import {
  LayoutDashboard,
  ClipboardCheck,
  Target,
  Map,
  FolderKanban,
  TrendingUp,
  Briefcase,
  ArrowLeftRight,
  BookOpen,
  BarChart3,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";

import { useState } from "react";

import GlobalSearch from "../components/GlobalSearch";
import NotificationBell from "../components/NotificationBell";
import ThemeToggle from "../components/ThemeToggle";

import { logout } from "../services/authService";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }

    navigate("/login");
  };

  const links = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },

    {
  label: "Activity",
  path: "/activity",
  icon: History
},

{
  label: "Saved",
  path: "/saved",
  icon: Bookmark
},
    {
      label: "Assessment",
      path: "/assessment",
      icon: ClipboardCheck
    },
    {
      label: "Skill Gap",
      path: "/skill-gap",
      icon: Target
    },
    {
      label: "Roadmap",
      path: "/roadmap",
      icon: Map
    },
    {
      label: "Projects",
      path: "/projects",
      icon: FolderKanban
    },
    {
      label: "Progress",
      path: "/progress",
      icon: TrendingUp
    },
    {
      label: "Careers",
      path: "/careers",
      icon: Briefcase
    },
    {
      label: "Compare Roles",
      path: "/role-comparison",
      icon: ArrowLeftRight
    },
    {
      label: "Resources",
      path: "/resources",
      icon: BookOpen
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: BarChart3
    },
    {
      label: "Profile",
      path: "/profile",
      icon: User
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {mobileOpen && (
        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transform transition-transform lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="text-xl font-bold"
          >
            Skill<span className="text-blue-400">Path</span>
          </button>

          <button
            onClick={() =>
              setMobileOpen(false)
            }
            className="lg:hidden"
          >
            <X />
          </button>

        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-140px)]">

          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() =>
                  setMobileOpen(false)
                }
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {link.label}
              </NavLink>
            );
          })}

        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-5 left-4 right-4 flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={19} />
          Logout
        </button>

      </aside>

      <div className="lg:ml-72">

        <header className="h-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-30">

          <div className="h-full px-4 md:px-6 flex items-center gap-4">

            <button
              onClick={() =>
                setMobileOpen(true)
              }
              className="lg:hidden p-2"
            >
              <Menu />
            </button>

            <GlobalSearch />

            <div className="ml-auto">
              <NotificationBell />
            </div>

          </div>

        </header>

        <main>
          <Outlet />
        </main>

      </div>

    </div>
  );
}







// Then in the header:

// <div className="ml-auto flex items-center gap-2">

//   <ThemeToggle />

//   <NotificationBell />

// </div>