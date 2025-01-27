import { useFormulaItemById } from "@/hooks/dbs/useFormulaDb";
import { useParams } from "react-router";
import { Input } from "./Input";
import { RedirectTo404 } from "@/lib/routes";
import { GoogleLoginButton } from "./oauth/Google";
import { Icon } from "./Icon";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  getNameFromGoogleIDToken,
  getSubFromGoogleIDToken,
} from "@/lib/jwt";
import { AuthTokens } from "@/types/oauth";
import { toText } from "@/lib/app";
import { PublishListButton } from "./Buttons/PublishListButton";
import clsx from "clsx";

export const FormulaPublisher = ({}: { inventories: any }) => {
  const params = useParams();
  const formula = useFormulaItemById(params.formulaId);
  const [identity] = useLocalStorage<AuthTokens | null>(null, "identity");
  const [data, setData] = useState<{ author: string | null; desc?: string }>({
    author: null,
    desc: undefined,
  });
  if (formula === null)
    return (
      <div>
        <h1>404</h1>
        <RedirectTo404></RedirectTo404>
      </div>
    );

  const identifiedName =
    getNameFromGoogleIDToken(identity?.GOOGLE?.id_token) || "Anonymous";
  const authorLen = Number(data?.author?.length);
  return (
    <div className="py-2">
      <div className="flex gap-1">
        <hr
          className={clsx(" h-0.5 flex-1 border-0", {
            "bg-white": !data.author && !data.desc,
            "bg-yellow-500": authorLen < 3 || !identity?.GOOGLE?.id_token,
            "bg-green-500": authorLen >= 3 && identity?.GOOGLE?.id_token,
          })}
        ></hr>
        <h1 className="-mt-6 mb-1 bg-black/80 mx-auto w-min p-1 rounded-md border-white border-[1px]">
          Publish
        </h1>
        <hr
          className={clsx(" h-0.5 flex-1 border-0", {
            "bg-white": !data.author && !data.desc,
            "bg-yellow-500": authorLen < 3 || !identity?.GOOGLE?.id_token,
            "bg-green-500": authorLen >= 3 && identity?.GOOGLE?.id_token,
          })}
        ></hr>
      </div>
      <h2>{formula?.title}</h2>
      <span className="flex gap-1 w-full">
        <Input
          valid={Number(data?.author?.length) > 2}
          value={data?.author || ""}
          placeholder="Nickname"
          label="Author:"
          className="w-full"
          onChange={(e: any) => setData({ ...data, author: e.target.value })}
        ></Input>
      </span>
      <div className="flex flex-row gap-1 items-end">
        <Input
          placeholder="Anonymous"
          label="Identity"
          className="w-full"
          disabled
          value={identifiedName}
        ></Input>
        <GoogleLoginButton className="mb-1" scheme="black"></GoogleLoginButton>
      </div>

      <p className="text-xs mb-1">
        <Icon
          icon="FaInfo"
          className="bg-sky-500 p-1 rounded-full w-[1rem] h-[1rem] inline-block"
        ></Icon>{" "}
        In order to credit creations, we ask your identity before publishing.
      </p>
      <fieldset className="mt-6">
        <label
          htmlFor={"ta.publish"}
          className="bg-black/80 p-1 absolute text-sm -top-5 z-10"
        >
          Description
        </label>
        <textarea
          id="ta.publish"
          placeholder="140ch"
          rows={3}
          maxLength={140}
          value={data.desc}
          className="w-full resize-none bg-black/40 p-1"
          onChange={(e) => setData({ ...data, desc: e.target.value })}
        ></textarea>
      </fieldset>
      <pre>
        {toText(
          formula?.items?.sort(
            (a: any, b: any) => Number(b.usedAmount) - Number(a.usedAmount)
          ) || []
        )}
      </pre>
      {params.formulaId && (
        <PublishListButton
          disabled={!data.author}
          listId={params.formulaId}
          data={data as any}
          identity={getSubFromGoogleIDToken(identity?.GOOGLE?.id_token) as any}
          name={identifiedName}
        ></PublishListButton>
      )}
    </div>
  );
};
