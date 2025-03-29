import { useEffect, useState } from "react";
import { Button, ReactButton } from "../Button";
import { useIndexedDB } from "react-indexed-db-hook";
import { usePublishListMutation } from "@/apollo/queries/generated/graphql";
import { Icon } from "../Icon";
import clsx from "clsx";
import { useNavigate } from "react-router";
import { lngLnk } from "@/lib/util";
import useFormulaDb from "@/hooks/dbs/useFormulaDb";
import { IDBFormula } from "@/utils/dataStructure";

type PublishListButtonProps = {
  listId: string;
  data?: { author: string; desc: string };
  identity?: string;
  name?: string;
} & ReactButton;

export const PublishListButton = ({
  listId,
  disabled,
  identity,
  name,
  data,
}: PublishListButtonProps) => {
  const fragranceDb = useIndexedDB("formulas");

  const [formula, setFormula] = useState<IDBFormula | null>(null);
  const [publishList] = usePublishListMutation();

  const navigate = useNavigate();
  const formulaDb = useFormulaDb();

  useEffect(() => {
    (async () => {
      const list = await fragranceDb.getByID(Number(listId));
      setFormula(list);
    })();
  }, [fragranceDb, listId]);

  const publish = async () => {
    if (!formula || !formula?.title) return;
    if (!data || !data?.author?.length) return;

    const list = {
      title: formula.title,
      items: formula.ingredients.map((ing) => {
        return {
          title: ing.title,
          dilution: ing.dilution || "100%",
          amount: ing.size || (ing as any).amount,
          usedAmount: ing.usedAmount,
          unit: ing.unit || "g",
          price: ing.price,
        };
      }),
    };

    const meta = {
      identity: identity || "",
      name: name!,
      author: data?.author,
      desc: data?.desc,
    };
    const response = await publishList({ variables: { list, meta } });

    await formulaDb.update({
      ...formula,
      ...(response.data?.publishList || {}),
    });

    // console.log("UPDATE INDEXEDDB", upd, response);
    navigate(
      lngLnk`/formula/${meta.author || "*"}/${list.title}/?library=Moe&remote=1`
    );
  };
  const isInValid =
    formula === null || disabled || !identity || data!.author.length! < 3;
  return (
    <Button
      disabled={isInValid}
      className={clsx("!w-full font-semibold ", {
        "bg-green-500/40": !isInValid,
      })}
      //   iconClsn="!w-full"
      onClick={publish}
    >
      <Icon icon="MdPublish"></Icon>
      <span className="w-full text-center">Publish</span>
    </Button>
  );
};
