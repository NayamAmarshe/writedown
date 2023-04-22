/* eslint-disable react-hooks/exhaustive-deps */
import {
  defaultValueCtx,
  Editor,
  rootCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import type { MilkdownRef } from "@/components/playground-editor";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { history, historyKeymap } from "@milkdown/plugin-history";
import { TNotesData } from "@/types/utils/firebaseOperations";
import React, { useCallback, useEffect, useRef } from "react";
import { prism, prismConfig } from "@milkdown/plugin-prism";
import { commonmark } from "@milkdown/preset-commonmark";
import javascript from "refractor/lang/javascript";
import typescript from "refractor/lang/typescript";
import { math } from "@milkdown/plugin-math";
import { replaceAll } from "@milkdown/utils";
import python from "refractor/lang/python";
import { gfm } from "@milkdown/preset-gfm";
import shell from "refractor/lang/bash";
import java from "refractor/lang/java";
import rust from "refractor/lang/rust";
import yaml from "refractor/lang/yaml";
import json from "refractor/lang/json";
import css from "refractor/lang/css";
import jsx from "refractor/lang/jsx";
import tsx from "refractor/lang/tsx";
import cpp from "refractor/lang/cpp";
import { useAtomValue } from "jotai";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import "katex/dist/katex.min.css";
import c from "refractor/lang/c";
import Loading from "./Loading";

const PlaygroundMilkdown = dynamic(
  () =>
    import("@/components/playground-editor").then((module) => ({
      default: module.PlaygroundMilkdown,
    })),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

interface editorProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  notes?: TNotesData[] | undefined;
}

const MilkdownEditor = ({ setInput, input, className, notes }: editorProps) => {
  const selectedNoteId = useAtomValue(selectedNoteIdAtom);

  const milkdownRef = useRef<MilkdownRef>(null);

  const onMilkdownChange = useCallback((markdown: string) => {}, []);

  return (
    <PlaygroundMilkdown
      milkdownRef={milkdownRef}
      content={input}
      onChange={onMilkdownChange}
    />
  );
};

export default MilkdownEditor;
