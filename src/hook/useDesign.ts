import { DesignContext } from "@/providers/DesignProvider";
import { useContext } from "react";

export function useDesign() {
  const context = useContext(DesignContext);

  if (!context) {
    throw new Error('DesignContext must be used within a DesignContext.Provider');
  }

  return context;
}