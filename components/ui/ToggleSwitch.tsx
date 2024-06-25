import { Switch } from "@headlessui/react";
import { useState } from "react";

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ToggleSwitch({
  enabled,
  setEnabled,
}: ToggleSwitchProps) {
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${enabled ? "bg-blue-500" : "bg-slate-500"}
          relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`${enabled ? "translate-x-7" : "translate-x-0"}
            pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  );
}
