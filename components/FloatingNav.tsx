"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Compass, PenLine } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/editor/new", label: "Create", icon: PenLine },
];

export default function FloatingNav() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      onMouseLeave={() => setHovered(null)}
    >
      <div className="flex items-center gap-1 px-2 py-2 bg-white/40 backdrop-blur-md rounded-[24px] shadow-sm">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const isHovered = hovered === item.label;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => setHovered(item.label)}
              className="flex items-center transition-all duration-300 ease-out"
              style={{
                padding: isHovered || isActive ? "8px 16px 8px 12px" : "8px 12px",
                borderRadius: "20px",
                background: isActive
                  ? "rgba(201, 138, 116, 0.12)"
                  : isHovered
                  ? "rgba(92, 64, 38, 0.06)"
                  : "transparent",
                color: isActive ? "#5b4636" : "#a8896a",
              }}
            >
              <Icon
                size={18}
                strokeWidth={1.5}
                style={{
                  opacity: isActive ? 0.9 : 0.65,
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                }}
              />

              <span
                className="ml-2 whitespace-nowrap text-[13px] tracking-wide transition-all duration-300 overflow-hidden"
                style={{
                  maxWidth: isHovered || isActive ? "80px" : "0px",
                  opacity: isHovered || isActive ? 1 : 0,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}