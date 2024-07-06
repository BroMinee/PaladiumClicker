import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/shared/ThemeProvider";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ToggleTheme() {
  const { theme, systemTheme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  function toggleTheme() {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }

  return (
    <Button variant="ghost" size="icon" onClick={() => toggleTheme()}>
      {currentTheme === "dark" ? <FaMoon/> : <FaSun/>}
    </Button>
  );
}
