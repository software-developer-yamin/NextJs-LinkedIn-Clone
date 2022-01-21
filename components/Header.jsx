import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Avatar from "@mui/material/Avatar";
import { motion} from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import HeaderLink from "./HeaderLink";

function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  console.log("Current theme is", theme);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#1D2226] flex items-center justify-around py-1.5 px-3 focus-within:shadow-lg">
      <div className="flex items-center space-x-2 w-full max-w-xs">
        {mounted && (
          <>
            {resolvedTheme === "dark" ? (
              <Image
                src="https://rb.gy/bizvqj"
                width={45}
                height={45}
                loading="lazy"
                objectFit="contain"
              />
            ) : (
              <Image
                src="https://rb.gy/dpmd9s"
                width={55}
                height={55}
                loading="lazy"
                objectFit="contain"
              />
            )}
          </>
        )}
        <div className="flex items-center space-x-1 dark:md:bg-gray-700 py-2.5 px-4 rounded w-full">
          <SearchRoundedIcon />
          <input
            placeholder="Search"
            className="hidden md:inline-flex text-sm bg-transparent focus:outline-none placeholder-black dark:placeholder-white/75 flex-grow"
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <HeaderLink Icon={HomeRoundedIcon} text="Home" feed active />
        <HeaderLink Icon={GroupIcon} text="My Network" feed />
        <HeaderLink Icon={BusinessCenterIcon} text="Jobs" feed hidden />
        <HeaderLink Icon={ChatIcon} text="Messaging" feed />
        <HeaderLink Icon={NotificationsIcon} text="Notifications" feed />
        <HeaderLink Icon={Avatar} text="Me" feed avatar hidden />
        <HeaderLink Icon={AppsOutlinedIcon} text="Work" feed hidden />

        {mounted && (
          <div
            className={`flex items-center bg-gray-600 px-0.5 rounded-full h-6 w-12 cursor-pointer flex-shrink-0 relative ${
              resolvedTheme === "dark" ? "justify-end" : "justify-start"
            } `}
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <span className="absolute left-0">🌜</span>
            <motion.div
              className="w-5 h-5 bg-white rounded-full z-40"
              layout
              transition={spring}
            />
            <span className="absolute right-0.5">🌞</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
