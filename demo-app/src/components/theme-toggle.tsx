"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button onClick={() => toggleTheme()}>
      <span className="sr-only">Toggle Theme</span>
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
