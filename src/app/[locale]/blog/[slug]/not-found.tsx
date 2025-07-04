import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getBlogPost } from "@/lib/api";
import { getNotFoundContext } from "@/lib/context";
import { blogPostLink } from "@/lib/links";
import { BlogPostProps } from "@/types/BlogPost";
import { notFound } from "next/navigation";

export default async function NotFound() {
  const params = getNotFoundContext();
  const { slug, locale = "en" } = params || {};

  const translations = (
    await import(`@/assets/translations/${locale}.ts`)
  ).default.notFound;
  const t = (key: string) => translations?.[key] || key;

  const id = (slug as string)?.split("-").pop();
  if (!id || !slug?.includes("-") || id.length < 23) return notFound();

  const post = await getBlogPost(id, { locale: "" });
  if (!post) return notFound();

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-1">
      <div className="flex  items-center justify-center  text-center gap-2">
        <h1 className="font-bold text-red-500">404</h1>
        <div className="border-l-2 border-white h-8" />
        <p className="text-gray-600">{t("404")}</p>
      </div>

      <h1>{t("differentLocale")}</h1>

      <LanguageSwitcher
        showCurrent
        href={blogPostLink({ locale, post, searchParams: {ui: 0}})}
        availableLocales={[
          post.locale,
          ...post.localizations?.map((p: BlogPostProps) => p.locale),
        ]}
      ></LanguageSwitcher>
    </div>
  );
}
