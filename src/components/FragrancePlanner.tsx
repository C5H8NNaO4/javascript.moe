import clsx from "clsx";
import { Chip, Component } from "./Chip";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { useEffect, useState } from "react";
import {
  AutoSuggestItem,
  Formula,
  FormulaItem,
  Inventories,
  Item,
} from "./Inventory";
import { ingredients as imgs } from "@/static/assets";
import { Button, DestructiveButton, IconButton, MenuButton } from "./Button";
import { Icon } from "./Icon";
import {
  similarity,
  totalIngredientCost,
  totalUsedIngredientAmount,
} from "@/lib/util";
import { perfumeIngredientsOdours } from "@/static/descriptions";
import { utilities } from "@/static/categories";
import { useIndexedDB } from "react-indexed-db-hook";
import { Input } from "./Input";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Link, useSearchParams } from "react-router-dom";
import i18next from "i18next";
export type FragrancePlannerProps = Component<{
  className?: string;
  inventories: {
    remote: Inventories;
    local: Inventories;
  };
}>;
export const FragrancePlanner = (props: FragrancePlannerProps) => {
  const { className, inventories } = props;
  const db = useIndexedDB("inventory");
  const [search, setSearch] = useSearchParams();
  const source = search.get("source") || "remote";
  const library = search.get("library") || "Moe";

  const [storedListLkp, setStoredLkp] = useState<Record<string, Item[]>>(
    inventories.local
  );
  const [localLists, setLocalLists] = useLocalStorage(
    Object.keys(inventories.local),
    "localLists"
  );

  const inventory =
    (source === "remote"
      ? inventories.remote[library]
      : storedListLkp?.[library.trim()]) || [];

  const loadLocalLists = async () => {
    const res = (await db.getAll()) || [];
    setLocalLists(
      [
        ...new Set([
          ...Object.keys(inventories?.local),
          ...localLists,
          ...res.map((itm) => {
            return itm.list;
          }),
        ]),
      ].filter(Boolean)
    );
    setStoredLkp({
      ...storedListLkp,
      ...res.reduce((acc, itm) => {
        return { ...acc, [itm.list]: [...(acc[itm.list] || []), itm] };
      }, {}),
    });
  };

  console.log("INVENTORY", "'" + library + "'", inventories?.remote[library]);
  useEffect(() => {
    loadLocalLists();
  }, []);

  const [ingredients, setIngredients] = useLocalStorage<FormulaItem[]>(
    [],
    "formulaDraft"
  );
  const [value, setValue] = useState("");
  const [baseUnit, setBaseUnit] = useState("g");
  const [step, setStep] = useState(0.1);
  const [probeAmount, setProbeAmount] = useState(0.1);
  const [fragrances, setFragrances] = useState<Formula[]>([]);
  const [formula, setFormula] = useState<Formula | null>(null);
  const fragranceDb = useIndexedDB("formulas");

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [edit, setEdit] = useState(false);
  const [showList, setShowList] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const load = async () => {
    const list = await fragranceDb.getAll();
    setFragrances(list);
  };
  useEffect(() => {
    load();
  }, []);

  const toText = () => {
    return ingredients?.reduce((txt, ing) => {
      return (
        txt + `${ing.title} ${ing.usedAmount}${ing.unit} ${ing.dilution}\n`
      );
    }, "");
  };

  useEffect(() => {
    if (formula?.ingredients?.length) setIngredients(formula?.ingredients);
    if (formula?.title) setTitle(formula?.title);
  }, [formula]);

  const fromText = (txt: string) => {
    const ings = txt
      .trim()
      ?.split("\n")
      ?.map((line: string) => {
        const title = line
          .replace(/\d\./, "")
          .replace(/\s\d+[%]/, "")
          .replace(/\d+[g]/, "")
          ?.trim();
        const amount = /(\d?\.?\d+)[g]/.exec(line)?.[1];
        const unit = "g";

        const dilution = /\d+%$/.exec(line)?.[0];
        const ing = inventory?.find(
          (ing) => ing.title?.trim() === title?.trim()
        );
        console.log("TITLE", "'" + title + "'", ing);

        return {
          ...ing,
          usedAmount: Number(amount),
          unit,
          dilution: dilution,
        };
      });
    return ings as FormulaItem[];
  };
  const update = (title: string) => (ing: Partial<FormulaItem>) => {
    const existing = ingredients.find((inv) => inv.title === title);

    if (!existing) return;

    const index = ingredients.indexOf(existing);

    const newIngs = ingredients.slice();
    newIngs.splice(index, 1, {
      ...existing,
      ...ing,
    });

    setIngredients(newIngs);
  };

  const totalAmount = ingredients.reduce(
    totalUsedIngredientAmount(baseUnit),
    0
  );

  const removeProbe = (amount: number) => {
    const newIngs = ingredients.map((ing) => {
      const prc = (100 / totalAmount) * Number(ing.usedAmount);
      const toRemove = (amount / 100) * prc;
      const newAmount =
        Math.round(100 * (Number(ing.usedAmount) - toRemove)) / 100;
      return { ...ing, usedAmount: newAmount };
    });

    setIngredients(newIngs);
  };

  const onAdd = (title: string) => {
    const toAdd = inventory.find((inv) => inv.title === title);
    setValue("");
    setIngredients(
      [
        ...ingredients,
        {
          ...toAdd,
          unit: baseUnit,
          usedAmount: 0.1,
        },
      ].filter(Boolean) as Item[]
    );
  };

  const save = async () => {
    if (!formula?.id) {
      await fragranceDb.add({
        title: title || new Date().toDateString(),
        ingredients,
      });
    } else {
      await fragranceDb.update({
        id: formula?.id,
        title: title || new Date().toDateString(),
        ingredients,
      });
    }
  };

  const remove = async (id: string) => {
    if (!id) return;
    await fragranceDb.deleteRecord(id);
  };

  return (
    <div className={clsx("w-full h-full flex flex-col", {}, className)}>
      <div className="flex gap-2 mb-2 items-center">
        <IconButton
          disabled={!formula}
          icon="FaPlus"
          onClick={() => {
            setFormula(null);
            setIngredients([]);
            setTitle("");
          }}
        ></IconButton>
        <IconButton
          className={clsx({
            "bg-green-500/40 hover:bg-green-500/30": showList,
            "hover:bg-green-500/20": !showList,
          })}
          icon="FaList"
          onClick={() => setShowList(!showList)}
        ></IconButton>
        <IconButton
          className={clsx({
            "bg-green-500/40 hover:bg-green-500/30 text-yellow-500":
              showSuggestions,
            "hover:bg-green-500/20": !showSuggestions,
          })}
          icon="FaLightbulb"
          onClick={() => setShowSuggestions(!showSuggestions)}
        ></IconButton>
        <MenuButton
          className={clsx(
            {
              "hover:bg-orange-500/30": true,
            },
            "!h-9 !w-9"
          )}
          icon="IoLibrary"
        >
          {Object.keys(inventories?.remote)?.map((list) => {
            return (
              <Button
                className={clsx("flex gap-2 items-center !w-full ", {
                  "font-semibold text-yellow-500":
                    library === list && source === "remote",
                })}
                onClick={() => {
                  setSearch({
                    library: list,
                    source: "remote",
                  });
                }}
              >
                <Icon icon="FaServer" className="!h-5 !w-5"></Icon>
                {list}
              </Button>
            );
          })}
          {localLists?.map((list: string) => {
            return (
              <Button
                className={clsx("flex gap-2 items-center !w-full", {
                  "font-semibold text-yellow-500":
                    library === list && source === "local",
                })}
                onClick={() => {
                  setSearch({
                    library: list,
                    source: "local",
                  });
                }}
              >
                <Icon icon="FaBook" className="!h-5 !w-5"></Icon>
                {list}
              </Button>
            );
          })}
        </MenuButton>
        <ReactSearchAutocomplete
          placeholder="Add Ingredients"
          className="z-[100000] w-full"
          inputSearchString={value}
          onSearch={(s) => setValue(s)}
          items={inventory.map(({ title }) => ({ name: title }))}
          // onSearch={handleOnSearch}
          // onHover={handleOnHover}
          onSelect={(ing) => onAdd(ing.name)}
          // onFocus={handleOnFocus}
          // autoFocus
          showIcon={false}
          formatResult={(itm: AutoSuggestItem) => {
            return (
              <div className="flex gap-2">
                <img src={imgs[itm.name.trim()]} className="h-8 w-8"></img>
                {itm.name}
              </div>
            );
          }}
        />
      </div>
      <div className="flex gap-4 w-full h-full relative -z-10">
        {showList && (
          <div className="shrink-1 min-w-[200px] shadow-sm bg-white/20 h-full">
            <div className="text-gray-200 bg-black/20 p-2 font-semibold border-white flex justify-between items-center text-xl">
              Formulas
              <Link
                to={"/" + i18next.language + "/inventory"}
                className="text-blue-500"
              >
                <Icon icon="MdInventory" className="!h-8 !w-8"></Icon>
              </Link>
            </div>
            <ul>
              {fragrances?.map((frmla) => {
                return (
                  <li
                    className={clsx(
                      {
                        "bg-white/40": frmla?.id === formula?.id,
                      },
                      "flex justify-between p-1 gap-2 items-center"
                    )}
                  >
                    <button
                      onClick={() => {
                        setFormula(frmla);
                      }}
                    >
                      {frmla?.title} ({frmla?.ingredients?.length})
                    </button>
                    <DestructiveButton
                      icon="FaTrash"
                      className="!h-5 !w-5"
                      iconClsn=""
                      onDestruct={(confirm) => {
                        if (confirm && frmla?.id) remove(frmla?.id);
                      }}
                      level={2}
                    ></DestructiveButton>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex gap-1 ">
            <div>
              Unit
              <select
                className="bg-black/40 ml-1"
                value={baseUnit}
                onChange={(e) => setBaseUnit(e.target.value)}
              >
                <option value="g">Grams</option>
                <option value="ml">Ml</option>
                <option value="dr">Drops</option>
              </select>
            </div>
            <label>
              Step
              <input
                className="bg-black/40 w-[8ch] ml-1"
                step={0.1}
                type="number"
                value={step}
                onChange={(e) => setStep(Number(e.target.value))}
              ></input>
              <span>{baseUnit}</span>
            </label>
            <label>
              Probe Amount
              <input
                className="bg-black/40 w-[8ch] ml-2"
                step={0.1}
                type="number"
                value={probeAmount}
                onChange={(e) => setProbeAmount(Number(e.target.value))}
              ></input>
              <span>{baseUnit}</span>
            </label>
          </div>

          <div className="flex flex-col md:flex-row w-full">
            <div className="w-full flex gap-2">
              <Input
                placeholder="Title"
                className="bg-black/40 w-full"
                value={title}
                onChange={(e) =>
                  setTitle((e.target as HTMLInputElement).value || "")
                }
              ></Input>
              <div className="flex gap-1">
                <IconButton
                  icon="GiPouringChalice"
                  onClick={() => {
                    removeProbe(0.2);
                  }}
                ></IconButton>
                <IconButton
                  icon="FaPencil"
                  onClick={() => {
                    if (!edit) {
                      setEdit(true);
                      setText(toText());
                    } else {
                      setIngredients(fromText(text));
                      setEdit(false);
                    }
                  }}
                ></IconButton>
                <IconButton
                  disabled={!title}
                  title={
                    !title
                      ? "Set a title to save."
                      : "Save this formula locally."
                  }
                  icon="FaSave"
                  onClick={() => {
                    save();
                  }}
                ></IconButton>
              </div>
            </div>
          </div>

          {!edit && (
            <div className="flex flex-col flex-grow overflow-y-auto !min-h-0 mt-1 pr-1 max-h-[60vh]">
              <ul className="">
                {ingredients.map((itm, i) => {
                  return (
                    <FormulaIngredient
                      {...itm}
                      step={step}
                      update={update(itm.title)}
                      remove={() => {
                        const newIngs = ingredients.slice();
                        newIngs.splice(i, 1);
                        setIngredients(newIngs);
                      }}
                    ></FormulaIngredient>
                  );
                })}
              </ul>
            </div>
          )}
          {edit && (
            <div>
              <textarea
                value={text}
                className="bg-black/40 w-full h-full"
                rows={10}
                onChange={(e) => {
                  setText(e.target.value.trim());
                }}
              ></textarea>
            </div>
          )}
          <div className="flex gap-2 items-center mt-4">
            <Chip
              className="bg-blue-500"
              icon="FaFlask"
              label={ingredients?.length?.toString()}
            ></Chip>
            <Chip
              className="bg-gray-500"
              icon="TbSum"
              label={totalAmount.toFixed(2) + baseUnit}
            ></Chip>
            <Chip
              className="bg-yellow-500"
              icon="FaDollarSign"
              label={ingredients.reduce(totalIngredientCost, 0).toFixed(2)}
            ></Chip>
          </div>
        </div>
        {showSuggestions && (
          <div className="w-[330px] overflow-hidden h-full ">
            <div className="overflow-y-scroll max-h-full h-[90%] mb-8">
              <div>
                <div className="bg-white/40">Utilities</div>
                {utilities
                  .filter(
                    (title) => !ingredients.some((ing) => title === ing.title)
                  )
                  .map((title) => {
                    return inventory?.find((inv) => inv.title.includes(title));
                  })
                  .map((ing) => {
                    return (
                      <SuggestedIngredient
                        {...ing}
                        onAdd={onAdd.bind(0, ing?.title || "")}
                      ></SuggestedIngredient>
                    );
                  })}
                <div className="bg-white/40">Similar</div>
                <div>
                  {inventory
                    .filter((inv) => {
                      return perfumeIngredientsOdours[inv.title]?.some(
                        (odor) => {
                          return ingredients?.some((ing) =>
                            perfumeIngredientsOdours[ing.title]?.includes(odor)
                          );
                        }
                      );
                    })
                    .sort((a, b) => {
                      return (
                        similarity(b, ingredients) - similarity(a, ingredients)
                      );
                    })

                    .map((ing) => {
                      return (
                        <SuggestedIngredient
                          {...ing}
                          onAdd={onAdd.bind(0, ing.title)}
                        ></SuggestedIngredient>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export type FormulaIngredientProps = Component<{
  className?: string;
  title: string;
  step: number;
  update?: (itm: Partial<FormulaItem>) => void;
  remove?: () => void;
}> &
  FormulaItem;
export const FormulaIngredient = (props: FormulaIngredientProps) => {
  const { title, usedAmount, unit, update, remove, step } = props;
  return (
    <li className="flex gap-2">
      <img src={imgs[title?.trim()]} className="h-8 w-8"></img>
      <div>{title}</div>
      <div>
        {usedAmount}
        {unit}
      </div>

      <div className="ml-auto flex gap-1">
        <IconButton
          icon="FaMinus"
          onClick={() => {
            update?.({
              usedAmount: Math.round(100 * (Number(usedAmount) - step)) / 100,
            });
          }}
        ></IconButton>
        <IconButton
          icon="FaPlus"
          onClick={() => {
            update?.({
              usedAmount: Math.round(100 * (Number(usedAmount) + step)) / 100,
            });
          }}
        ></IconButton>
        <DestructiveButton
          icon="FaTrash"
          level={1}
          onDestruct={() => {
            remove?.();
          }}
        ></DestructiveButton>
      </div>
    </li>
  );
};

export const SuggestedIngredient = (props: {
  title?: string;
  onAdd: () => void;
}) => {
  const { title, onAdd } = props;
  return (
    <li className="flex gap-2">
      <img src={imgs[title || ""]} className="h-8 w-8"></img>
      <div>{title}</div>

      <div className="ml-auto flex gap-1 items-center">
        <IconButton
          icon="FaPlus"
          className="!h-7 !w-7"
          iconClsn=""
          onClick={() => {
            onAdd();
          }}
        ></IconButton>
      </div>
    </li>
  );
};
