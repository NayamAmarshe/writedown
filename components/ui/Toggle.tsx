import { Switch } from "@headlessui/react";
import { useState } from "react";

type ToggleProps = {
  enabled: boolean;
  onChange: (arg: boolean) => void;
  screenReaderPrompt?: string;
};

export default function Toggle({
  enabled,
  onChange,
  screenReaderPrompt,
}: ToggleProps) {
  return (
    <Switch
      name="toggle"
      checked={enabled}
      onChange={onChange}
      className={`${!enabled ? "bg-rose-500" : "bg-emerald-400"}
          relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-500 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span className="sr-only">{screenReaderPrompt}</span>
      <span
        aria-hidden="true"
        className={`${enabled ? "translate-x-5" : "translate-x-0"}
            pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-500 ease-in-out`}
      />
    </Switch>
  );
}
