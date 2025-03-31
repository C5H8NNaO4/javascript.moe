import {
  useApproveListMutation,
  useGetStarsQuery,
  useListFormulasQuery,
  useSearchFormulasQuery,
  useStarListMutation,
} from "@/apollo/queries/generated/graphql";
import ReactDOM from "react-dom";
import { Component, OdorChip } from "./Chip";
import clsx from "clsx";
import { NumberOfItemsChip } from "./Chips/NumberofItemsChip";
import { dist, findCheapestByTitle, lngLnk, randItm, unique } from "@/lib/util";
import {
  FormulaItem,
  Formula as FormulaType,
  Inventories,
  LocalInventories,
  Notification,
} from "./Inventory";
import { inventory } from "@/static/inventory";
import { CostPerMlChip } from "./Chips/CostPerMlChip";
import { perfumeIngredientsOdours } from "@/static/descriptions";
import { formulas } from "@/static/assets";
import { toText } from "@/lib/app";
import { FormulaIngredient, FormulaIngredientProps } from "./FragrancePlanner";
import { IconButton } from "./Button";
import { useNavigate, useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Icon } from "./Icon";
import { getSubFromGoogleIDToken } from "@/lib/jwt";
import { AuthTokens } from "@/types/oauth";
import useFormulaDb, {
  useFormulas,
  useLocalFormulas,
} from "@/hooks/dbs/useFormulaDb";
import copy from "copy-to-clipboard";
import { NavButton } from "./NavButton";
import { useIdentity } from "@/lib/hooks/useIdentity";
import { Tooltip } from "react-tooltip";
import { ActionButton } from "./ActionButton";
import { ToggleButton } from "./ToggleButton";
import { NormalizedItem } from "libperfumery/dist/types/NormalizedItem";
import { useHydrated } from "@/lib/hooks/useHydrated";

export const FormulaList = ({
  inventories,
  onSelect,
}: {
  inventories: any;
  onSelect?: (frmla: FormulaType | null) => void;
}) => {
  const id = useIdentity();
  const cachedId = useMemo(() => id.trackUse(), []);
  const { data } = useListFormulasQuery({
    context: {
      headers: {
        authorization: cachedId?.active?.signed,
      },
    },
  });

  const [existingFormulas] = useFormulas(data?.listFormulas || []);

  const [recent, setRecent] = useLocalStorage<Array<FormulaType | null>>(
    [],
    "recentFormulas"
  );

  const [formulas] = useFormulas(
    recent
      ?.map((r) => {
        return (existingFormulas?.find(
          (e) => e?.title === r?.title && e?.author === r?.author
        ) || null) as any;
      })
      .filter(Boolean)
  );

  const params = useParams();

  const { title: paramsTitle, author } = params;
  const selected = existingFormulas?.find(
    (itm) =>
      itm?.title === paramsTitle && (itm?.author === author || author === "*")
  );

  useEffect(() => {
    if (!selected) return;
    const existing = recent?.findIndex((r) => {
      return r?.title === selected?.title && r?.author === selected?.author;
    });
    const updated = recent?.slice();
    const cur = {
      title: selected?.title,
      author: selected?.author,
    };
    if (existing >= 0) {
      updated?.splice(existing, 1);
      updated.unshift(cur as any);
    } else {
      updated.unshift(cur as any);
    }
    setRecent(updated);
  }, [JSON.stringify(recent), selected?.title]);
  return (
    <ul
      className={clsx(
        "formulas flex flex-col gap-0 flex-shrink-0 pr-2 bg-white/40 min-w-max",
        {
          "hidden md:flex": !!selected,
        }
      )}
      style={{
        boxShadow: "1px 0px 4px 0px rgba(255,255,255,0.7)",
      }}
    >
      {formulas?.slice(0, 10).map((formula) => (
        <li
          className={clsx("p-1 min-w-max", {
            "mr-[-8px] pr-[12px] ml-[-1rem] pl-[20px] bg-white/40 z-10":
              selected?.title === formula?.title &&
              selected?.author === formula?.author,
            "mr-[-8px] pr-[12px] ml-[-1rem] pl-[20px] bg-black/20":
              selected?.title !== formula?.title ||
              selected?.author !== formula?.author,
          })}
        >
          <FormulaEntry
            formula={formula}
            inventory={inventories.remote.Moe}
            inventories={inventories}
            onClick={onSelect}
            isSelected={
              selected?.title === formula?.title &&
              selected?.author === formula?.author
            }
            hasBrightBg
          ></FormulaEntry>
        </li>
      ))}
    </ul>
  );
};

export type FormulaEntryProps = Component<{
  formula: FormulaType;
  className?: string;
  onClick?: (frmla: FormulaType | null) => void;
  onToggle?: () => void;
  inventory: NormalizedItem[];
  inventories: Inventories;
  readonly?: boolean;
  isSelected?: boolean;
  selected?: FormulaEntryProps;
  shrink?: boolean;
  hasBrightBg?: boolean;
  search?: string;
  published?: boolean;
}>;
export const FormulaEntry = (props: FormulaEntryProps) => {
  const {
    className,
    formula,
    onClick,
    inventory,
    isSelected,
    shrink = false,
    hasBrightBg = false,
    search,
  } = props;
  const { title, token, author, items, published } = formula;
  const hydratedItems = items.map((frmItm) => ({
    ...findCheapestByTitle(frmItm.title, inventory),
    ...frmItm,
  }));

  const { trackUse, active } = useIdentity();
  useEffect(() => {
    trackUse();
  }, [active]);
  const { data } = useGetStarsQuery({
    variables: {
      listId: formula.remoteId!,
    },
  });
  const { data: userData } = useGetStarsQuery({
    variables: {
      listId: formula.remoteId!,
      identity: getSubFromGoogleIDToken(active?.GOOGLE?.id_token) || "!",
    },
    context: {
      headers: {
        authorization: active?.signed,
      },
    },
  });
  const [approveList] = useApproveListMutation();

  return (
    <button
      className={clsx(
        " gap-2 max-h-min flex items-center   p-1 bg-white/70 rounded-md !backdrop-blur-sm",
        {
          "w-fit": shrink,
          "w-full": !shrink,
          "bg-white/20": isSelected,
        },
        className
      )}
      onClick={() => onClick?.(formula)}
    >
      {formulas[formula.title!] && (
        <img className="h-[96px]" src={randItm(formulas[formula.title!])}></img>
      )}
      <div className="flex flex-col gap-1 w-full md:w-fit">
        <div
          className={clsx("flex flex-col gap-2 items-start  w-full md:w-fit")}
        >
          <div
            className={clsx("text-center p-1 rounded-full w-full ", {
              "bg-white/10": !hasBrightBg && !isSelected,
              "!bg-black/10 text-gray-900": hasBrightBg && !isSelected,
              "!bg-yellow-500/70 text-gray-900": isSelected,
              "!bg-orange-500/70 text-gray-900": !published,
              "pb-[0px]": !!token,
            })}
          >
            <div className="flex gap-1 items-center pr-2">
              {published && (
                <Icon
                  icon="FaStar"
                  className={clsx("!h-6 w-6 -mt-1", {
                    "!text-black/40": Number(userData?.getStars) === 0,
                    "!text-yellow-500": Number(userData?.getStars) > 0,
                  })}
                >
                  <div
                    className={clsx(
                      "text-yellow-500/50 text-xs font-bold -mt-[3px]",
                      { "!text-white/80": Number(userData?.getStars) > 0 }
                    )}
                    style={
                      {
                        // textShadow: "0px 0px 0.5px black",
                      }
                    }
                  >
                    {data?.getStars}
                  </div>
                </Icon>
              )}
              {!published && (
                <IconButton
                  round
                  icon="FaCheck"
                  onClick={async () => {
                    await approveList({
                      variables: {
                        listId: formula.remoteId!,
                      },
                      context: {
                        headers: {
                          authorization: active?.signed,
                        },
                      },
                    });
                  }}
                ></IconButton>
              )}
              <div className="flex flex-col gap-1 items-center ">
                <div className="text-xl leading-5">{title}</div>
                {!token && (
                  <div className="text-xs italic">
                    {author || "Unknown Creator"}
                  </div>
                )}
                {!!token && (
                  <span className="italic inline-flex items-center text-sm">
                    <Icon
                      icon="MdVerified"
                      className="!text-sky-500  h-[1rem] w-[1rem] mt-[1px]"
                    ></Icon>
                    {author || "Unknown Creator"} (You)
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col  gap-1">
            <div className={clsx("flex gap-1 items-start")}>
              <NumberOfItemsChip items={items?.length} />
              <CostPerMlChip items={hydratedItems} />
            </div>
            <div className="flex flex-wrap w-fit gap-1 items-center">
              {unique(
                hydratedItems.flatMap(
                  (itm) =>
                    perfumeIngredientsOdours[itm?.title]?.slice(0, 3) || []
                )
              )
                .sort((a, b) => {
                  return dist(search || "", a) - dist(search || "", b);
                })
                .slice(0, 3)
                .map((odor) => (
                  <OdorChip odor={odor} size="xs" />
                ))}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export const Formula = ({
  formula,
  onSelect,
  selected,
  onToggle,
  expanded,
}: any) => {
  const { title: formulaTitle, items, remoteId } = formula;

  const hydrated = useHydrated(items) as FormulaIngredientProps[];
  const formulaDb = useFormulaDb();
  const navigate = useNavigate();
  const [activeIdentity] = useLocalStorage<AuthTokens | null>(
    null,
    "activeIdentity"
  );
  const { data, refetch } = useGetStarsQuery({
    variables: {
      listId: remoteId,
    },
  });
  const { data: userStarsData, refetch: refetchStarred } = useGetStarsQuery({
    variables: {
      listId: remoteId,
      identity:
        getSubFromGoogleIDToken(activeIdentity?.GOOGLE?.id_token) || "!",
    },
  });
  const { trackUse, trackSent, active } = useIdentity();
  useEffect(() => {
    trackUse();
  }, []);
  const [starList] = useStarListMutation({
    context: {
      headers: {
        authorization: active?.signed,
      },
    },
  });
  const [notification, setNotification] = useState("");
  const [formulas] = useFormulas();
  const [localFormulas, { refetch: refetchLocalFormulas }] = useLocalFormulas();
  const saveToDB = async () => {
    const exists = formulas?.some((f) => f?.remoteId === remoteId);
    const { items, ingredients, ...rest } = formula;
    const ings = items || ingredients;
    if (exists) {
      await formulaDb?.update({ ...rest, ingredients: ings });
    } else {
      await formulaDb.add({ ...rest, ingredients: ings });
    }
    await refetchLocalFormulas();
  };
  return (
    <div
      className={clsx(
        "formula flex  justify-center bg-white/20 rounded-r-lg h-full flex-shrink-1 w-full",

        {
          " sm:relative !translate-x-[calc(-100%+48px)]   sm:!translate-x-0 ":
            expanded,
          "!min-w-[calc(100vw-48px)] sm:!min-w-0": !expanded,
        }
      )}
    >
      <div className="h-full flex flex-col gap-1 w-full">
        <div className="flex justify-between items-center gap-0 flex-col">
          <h1
            id="title"
            className="p-2 w-full text-center bg-black/40 text-gray-200"
          >
            {formulaTitle}
          </h1>
          <em className="nohover:block hidden m-1">{formula.desc}</em>
          {ReactDOM.createPortal(
            <Tooltip
              anchorSelect="#title"
              className="z-[10000] nohover:hidden md:block"
            >
              {formula.desc}
            </Tooltip>,
            document.body
          )}
        </div>
        <div className="flex gap-1 justify-between mr-1">
          <div className="relative flex flex-row gap-1">
            <ActionButton
              id="starbutton"
              needsLogin
              disabled={!activeIdentity}
              constructive
              onConstruct={async () => {
                trackSent();
                await starList({
                  variables: {
                    listId: remoteId,
                    identity:
                      getSubFromGoogleIDToken(
                        activeIdentity?.GOOGLE?.id_token
                      ) || "",
                  },
                });
                await refetch();
                await refetchStarred();
              }}
              className="!rounded-r-full !pr-4 border-yellow-400 !h-8 !w-9"
              style={{
                filter:
                  Number(userStarsData?.getStars) > 0
                    ? "drop-shadow(0px 0px 3px rgb(250 204 21))"
                    : "",
              }}
            >
              <Icon
                icon="FaStar"
                className={clsx("!h-6 !w-6", {
                  "!text-yellow-500": Number(userStarsData?.getStars) > 0,
                })}
              >
                <div
                  className="text-yellow-500/50 text-[8px] font-bold"
                  style={{
                    textShadow: "0px 0px 0.5px black",
                  }}
                >
                  {data?.getStars}
                </div>
              </Icon>
            </ActionButton>
          </div>
          <div className="relative flex flex-row gap-1">
            {!!remoteId &&
              !localFormulas?.some((f) => f.remoteId === remoteId) && (
                <IconButton
                  icon="FaDownload"
                  id="downloadButton"
                  tooltip="Save in local library"
                  tooltipPlacement="bottom"
                  disabled={!remoteId}
                  onClick={() => {
                    saveToDB();
                  }}
                />
              )}

            {!!remoteId &&
              localFormulas?.some((f) => f.remoteId === remoteId) && (
                <NavButton
                  internal
                  icon="IoLibrary"
                  id="libraryButton"
                  tooltip="Open in local library"
                  tooltipPlacement="bottom"
                  disabled={
                    !localFormulas?.some((f) => f.remoteId === remoteId)
                  }
                  onClick={() => {
                    const localId = localFormulas?.find(
                      (f) => f.remoteId === remoteId
                    )?.id;
                    if (localId)
                      navigate(lngLnk`/formula/compose/${localId.toString()}`);
                  }}
                />
              )}
            <IconButton
              icon="FaCopy"
              id="copyButton"
              tooltip="Copy Formula"
              tooltipPlacement="bottom"
              onClick={() => {
                const text = toText(formula.items);

                copy(text);
                setNotification("Copied formula as plaintext.");
              }}
            />
            <IconButton
              icon="MdShare"
              id="shareButton"
              tooltip="Copy Link"
              tooltipPlacement="bottom"
              onClick={() => {
                copy(window.location.href);
                setNotification("Copied link to clipboard.");
              }}
            />
          </div>
          <div className="flex gap-1">
            <ToggleButton
              active={!!expanded}
              disabled={!selected?.title}
              icon="FaChevronLeft"
              id="collapseButton"
              tooltipPlacement="left"
              tooltip="Collapse"
              className={clsx(" !rounded-l-full !rounded-r-none", {
                "block sm:hidden": expanded,
              })}
              iconClsn={clsx({ "rotate-180 sm:rotate-0": expanded }, "p-1")}
              onClick={() => {
                onToggle?.();
              }}
            ></ToggleButton>
            <ActionButton
              icon="FaX"
              level={1}
              className={clsx(
                {
                  "hidden sm:block": expanded,
                },
                "!ml-0"
              )}
              onDestruct={() => {
                onToggle?.();
                navigate(lngLnk`/formulas`);
              }}
            ></ActionButton>
          </div>
        </div>
        <div className="overflow-y-scroll overflow-x-hidden ">
          <ul className="min-w-max">
            {hydrated.map((ing: FormulaIngredientProps) => {
              return (
                <li
                  onClick={() => onSelect(ing)}
                  className={clsx(
                    {
                      "bg-white/20": selected?.title === ing?.title,
                    },
                    "min-w-max pr-2"
                  )}
                >
                  <FormulaIngredient
                    {...ing}
                    readonly
                    library={"All"}
                    inventory={inventory as any}
                  ></FormulaIngredient>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {notification &&
        ReactDOM.createPortal(
          <Notification
            setNotification={() => {
              setNotification("");
            }}
            title={notification}
            className="!text-white"
          ></Notification>,
          document.body
        )}
    </div>
  );
};

export type FormulaCardsProps = {
  inventories: { remote: Inventories; local: LocalInventories };
  onSelect: (formula: FormulaType | null) => void;
  search: string;
};
export const FormulaCards = ({
  inventories,
  onSelect,
  search = "",
}: FormulaCardsProps) => {
  const { trackUse } = useIdentity();
  const cachedId = useMemo(() => trackUse(), []);
  const { data, previousData, loading } = useSearchFormulasQuery({
    fetchPolicy: "no-cache",
    variables: {
      q: search,
    },
    context: {
      headers: {
        authorization: cachedId.active?.signed,
      },
    },
  });

  const [formulas] = useFormulas(
    (loading
      ? previousData?.searchFormulas?.items || []
      : data?.searchFormulas?.items || []) as any
  );
  return (
    <div className="flex flex-row flex-wrap gap-2 w-full justify-start items-start h-full">
      <ul className="h-min flex flex-wrap gap-2">
        {formulas?.filter(Boolean)?.map((frmla) => (
          <li>
            <FormulaEntry
              hasBrightBg
              onClick={onSelect}
              shrink
              formula={frmla}
              inventories={inventories.remote}
              inventory={inventories.remote.Moe}
              search={search}
            ></FormulaEntry>
          </li>
        ))}
      </ul>
    </div>
  );
};
