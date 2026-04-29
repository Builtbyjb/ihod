import React, { useState, useContext, createContext } from "react";

type LayoutContextProps = {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

const LayoutContext = createContext<LayoutContextProps | null>(null);

type Props = {
  children: React.ReactNode;
};

export function LayoutProvider({ children }: Props) {
  const [title, setTitle] = useState("");
  return <LayoutContext.Provider value={{ title, setTitle }}>{children}</LayoutContext.Provider>;
}

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === null) throw new Error("Layout provider not available");
  return context;
};
