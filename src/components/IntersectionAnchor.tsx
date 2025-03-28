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
  });

  const observer = useMemo(() => {
    console.log("OBSERVER");

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
  }, [hash, location.hash, hasScrolled, setHasScrolled]);

  useEffect(() => {
    console.log("OBSERVER OBSERVE", hash, location.hash);
    if (!block && !rootMargin) return;
    if (ref.current) observer.observe(ref.current);
  }, [ref.current, observer]);

  useEffect(() => {
    console.log("OBSERVER SCROLL");
    if (!ref.current) return;
    if (location.hash === "#" + hash && !hasScrolled && scroll) {
      console.log("OBSERVER SCROLL!");

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
  }, [ref.current, loc.hash, hash, hasScrolled, setHasScrolled]);

  return (
    <a href={hash} ref={ref} className={className} id={hash}>
      {/* {children} */}
    </a>
  );
};
