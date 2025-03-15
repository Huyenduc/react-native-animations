import { useCallback, useState } from "react";

export function useModal<Payload = undefined>() {
  const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<Payload>();
  const toggle = useCallback((payload?: Payload) => {
    setIsOpen((_open) => !_open);
    setPayload(payload);
  }, []);
  const open = useCallback((payload?: Payload) => {
    setIsOpen(true);
    setPayload(payload);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
    setPayload(undefined);
  }, []);

  return {
    isOpen,
    toggle,
    open,
    close,
    payload,
  } as const;
}
