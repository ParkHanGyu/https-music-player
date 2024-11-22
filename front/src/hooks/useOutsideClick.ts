import { useRef, useEffect, useState } from "react";

function useOutsideClick<T extends HTMLElement>(initialState: boolean) {
  const [isOpen, setIsOpen] = useState(initialState);
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // 마운트 시 외부 클릭 이벤트 리스너 추가
    document.addEventListener("click", handleClickOutside);

    // 언마운트 시 외부 클릭 이벤트 리스너 제거
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return { isOpen, setIsOpen, ref };
}

export default useOutsideClick;
