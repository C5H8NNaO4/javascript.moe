import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export type IntersectionAnchorProps = {
  hash?: string;
  block?: ScrollIntoViewOptions["block"];
  rootMargin?: string;
  scroll?: boolean;
  scrollBy?: number;
  className?: string;
};
export const IntersectionAnchor = ({
  hash = "",
  block,
  rootMargin,
  scroll = false,
  scrollBy = 0,
  className,
}: IntersectionAnchorProps) => {
  const loc = useLocation();
  const nav = useNavigate();
  const ref = useRef<HTMLAnchorElement>(null);

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

        if (entry.isIntersecting && hasScrolled && (block || rootMargin)) {
          nav("#" + entry.target.id.replace("#", ""), {});
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
  }, [hasScrolled, block, nav, rootMargin]);

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

  useEffect(() => {
    if (!ref.current) return;
    if (!scroll || hasScrolled) return;
    if (location.hash === "#" + hash) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block,
      });
      if (scrollBy)
        setTimeout(() => {
          document.querySelector("html")?.scrollBy({
            top: scrollBy,
            behavior: "smooth",
          });
        }, 1000);
    }
  }, [block, scroll, hasScrolled, hash, scrollBy]);

  return (
    <a href={hash} ref={ref} className={className} id={hash}>
      {/* {children} */}
    </a>
  );
};
