import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/shared/ThemeProvider";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme !== "system" ? theme : "light";

  function toggleTheme() {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }

  return (
    <Button variant="ghost" size="icon" onClick={() => toggleTheme()}>
      {currentTheme === "dark" ? <FaMoon /> : <FaSun />}
    </Button>
  );
}
