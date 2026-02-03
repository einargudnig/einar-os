import React, { useState } from "react";
import { render, Box, Text } from "ink";
import SelectInput from "ink-select-input";
import { AddQuote } from "./components/AddQuote.js";
import { ListQuotes } from "./components/ListQuotes.js";

type Screen = "menu" | "add" | "list";

interface MenuItem {
  label: string;
  value: Screen | "exit";
}

const menuItems: MenuItem[] = [
  { label: "Add Quote", value: "add" },
  { label: "List Quotes", value: "list" },
  { label: "Exit", value: "exit" },
];

function App() {
  const [screen, setScreen] = useState<Screen>("menu");

  const handleSelect = (item: MenuItem) => {
    if (item.value === "exit") {
      process.exit(0);
    }
    setScreen(item.value as Screen);
  };

  const goToMenu = () => setScreen("menu");

  if (screen === "add") {
    return <AddQuote onBack={goToMenu} />;
  }

  if (screen === "list") {
    return <ListQuotes onBack={goToMenu} />;
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">
        Quotes Manager
      </Text>
      <Text color="gray" dimColor>
        Manage your quote collection
      </Text>

      <Box marginTop={1}>
        <SelectInput items={menuItems} onSelect={handleSelect} />
      </Box>
    </Box>
  );
}

render(<App />);
