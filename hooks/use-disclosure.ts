"use client";

import { useCallback, useMemo, useState } from "react";

/** Open/close state for menus, drawers, dialogs and popovers. */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);

  return useMemo(
    () => ({ isOpen, open, close, toggle, setIsOpen }),
    [isOpen, open, close, toggle],
  );
}
