import { useTheme } from "next-themes";
import Button from "../../ui/Button";

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
    >
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
