import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const id = hash.slice(1);
    let tries = 0;
    const scrollWhenReady = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries < 20) {
        tries += 1;
        setTimeout(scrollWhenReady, 50);
      }
    };
    scrollWhenReady();
  }, [pathname, hash]);

  return null;
}
