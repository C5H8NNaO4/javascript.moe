import { ListFormulasQuery } from "@/apollo/queries/generated/graphql";
import { Formula } from "@/components/Inventory";
import { DB_FORMULA } from "@/const/indexedDBNames";
import { adaptIndexedDBFormula, IDBFormula } from "@/utils/dataStructure";
import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";

const useFormulaDb = () => useIndexedDB(DB_FORMULA);

export const useFormulaItemById = (id?: string) => {
  const formulaDb = useFormulaDb();
  const [itm, setItm] = useState<IDBFormula | null | undefined>(undefined);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const frmla = await formulaDb.getByID(Number(id));
      setItm(frmla);
    } catch (e) {
      setItm(null);
    }
  }, [setItm, formulaDb, id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]);

  return itm;
};

const itemsAtom = atom<Formula[] | null>([]);
export const useFormulas = (
  remote?: ListFormulasQuery["listFormulas"]
): [Formula[], () => void] => {
  const formulaDb = useFormulaDb();
  const [itms, setItms] = useAtom<Formula[] | null>(itemsAtom);

  const load = useCallback(async () => {
    try {
      const itms = await formulaDb.getAll();
      setItms(itms.map(adaptIndexedDBFormula));
    } catch (e) {
      setItms(null);
    }
  }, [setItms, formulaDb]);

  useEffect(() => {
    load();
  }, []);

  const formulas =
    remote?.map((r) => {
      return {
        ...r,
        ...(itms?.find((itm) => r?.remoteId === itm.remoteId) || {}),
      } as Formula;
    }) || [];
  return [formulas, load];
};

export const useLocalFormulas = (
  remote: Formula[] = []
): [IDBFormula[], { refetch: () => void }] => {
  const formulaDb = useFormulaDb();
  const [itms, setItms] = useState<IDBFormula[] | null>([]);

  const load = useCallback(async () => {
    try {
      const itms = await formulaDb.getAll();
      setItms(itms);
    } catch (e) {
      setItms(null);
    }
  }, [setItms, formulaDb]);

  useEffect(() => {
    load();
  }, []);

  return [
    itms?.map((r) => {
      return {
        ...r,
        ...(remote?.find((itm) => r.remoteId === itm.remoteId) || {}),
      };
    }) || [],
    {
      refetch: load,
    },
  ];
};
export default useFormulaDb;
