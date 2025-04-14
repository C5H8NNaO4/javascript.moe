import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export type IntersectionAnchorProps = {
  hash?: string;
  block?: ScrollIntoViewOptions["block"];
  rootMargin?: string;
  scroll?: boolean;
  scrollBy?: number | number[];
  className?: string;
  noChange?: boolean;
};
export const IntersectionAnchor = ({
  hash = "",
  block,
  rootMargin,
  noChange,
  scroll = false,
  scrollBy = 0,
  className,
}: IntersectionAnchorProps) => {
  const loc = useLocation();
  const nav = useNavigate();
  const ref = useRef<HTMLAnchorElement>(null);
  const sem = useRef<boolean>(false);

  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScrollEnd = () => {
      setHasScrolled(true);
    };
    document.querySelector("html")?.addEventListener("scrollend", onScrollEnd);
    document.querySelector("html")?.addEventListener("scroll", onScrollEnd);
    document.querySelector("html")?.addEventListener("touchstart", onScrollEnd);
    document.querySelector("html")?.addEventListener("mousedown", onScrollEnd);

    // setTimeout(() => setHasScrolled(true), 2000)

    return () => {
      document
        .querySelector("html")
        ?.removeEventListener("scrollend", onScrollEnd);

      document
        .querySelector("html")
        ?.removeEventListener("touchstart", onScrollEnd);
      document
        .querySelector("html")
        ?.removeEventListener("mousedown", onScrollEnd);
      document
        .querySelector("html")
        ?.removeEventListener("scroll", onScrollEnd);
    };
  }, []);

  const observer = useMemo(() => {
    const intersectionObserver = new IntersectionObserver(
      (e) => {
        const [entry] = e;

        if (
          entry.isIntersecting &&
          hasScrolled &&
          !noChange &&
          (block || rootMargin)
        ) {
          (window as any).noReset = true;
          // setTimeout(() => {
          nav("#" + entry.target.id.replace("#", ""), { replace: true });
          // }, 0);
        }
      },
      {
        rootMargin:
          rootMargin || block === "center"
            ? "50%"
            : block === "start"
            ? "0%"
            : "100%",
      }
    );
    return intersectionObserver;
  }, [hasScrolled, block, rootMargin, noChange]);

  useEffect(() => {
    if (!ref.current) return;

    if (!block && !rootMargin) return;
    const oldRef = ref.current;
    observer.observe(ref.current);
    return () => {
      if (oldRef) observer.unobserve(oldRef);
      observer.disconnect();
    };
  }, [observer, block, rootMargin]);

  // useEffect(() => {
  //   if (!ref.current) return;
  //   if (loc.hash === "#" + hash) {
  //     ref.current?.scrollTo(0, 0);
  //     setTimeout(() => {
  //       ref.current?.scrollIntoView({
  //         behavior: "smooth",
  //         block: "center",
  //       });
  //     }, 900);
  //   }
  // }, [loc.hash, hash]);
  useEffect(() => {
    if (!ref.current) return;
    if (!scroll || hasScrolled || sem.current || (window as any).noReset)
      return;
    if (loc.hash === "#" + hash) {
      sem.current = true;
      const onload = () => {
        setTimeout(() => {
          ref.current?.scrollIntoView({
            behavior: "smooth",
            block,
          });
        }, 0);

        const scrolls = [scrollBy].flat().filter(Boolean);
        if (scrolls?.length) {
          scrolls.forEach((s, i) => {
            setTimeout(() => {
              document.querySelector("html")?.scrollBy({
                top: s,
                behavior: "smooth",
              });
              if (i === scrolls.length - 1) {
                sem.current = false;
                // setHasScrolled(false);
              }
            }, 900 * (i + 1));
          });
        }
      };
      onload();
      // window.addEventListener("DOMContentLoaded", onload);
      return () => {
        // window.removeEventListener("DOMContentLoaded", onload);
      };
    }
  }, [block, scroll, hasScrolled, hash, scrollBy, loc.hash]);

  return (
    <a ref={ref} className={className}>
      {/* {children} */}
    </a>
  );
};
