import {
  ListFormulasQuery,
} from "@/apollo/queries/generated/graphql";
import { Formula } from "@/components/Inventory";
import { DB_FORMULA } from "@/const/indexedDBNames";
import { adaptIndexedDBFormula } from "@/utils/dataStructure";
import { useCallback, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";

const useFormulaDb = () => useIndexedDB(DB_FORMULA);

export const useFormulaItemById = (id?: string) => {
  const formulaDb = useFormulaDb();
  const [itm, setItm] = useState<Formula | null | undefined>(undefined);

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

export const useFormulas = (
  remote?: ListFormulasQuery['listFormulas']
) => {
  const formulaDb = useFormulaDb();
  const [itms, setItms] = useState<Formula[] | null>([]);

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

  return remote?.map((r) => {
    return {
      ...r,
      ...(itms?.find((itm) => r?.remoteId === itm.remoteId) || {}),
    } as Formula;
  });
};

export const useLocalFormulas = (remote: Formula[] = []) => {
  const formulaDb = useFormulaDb();
  const [itms, setItms] = useState<Formula[] | null>([]);

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
    }),
    {
      refetch: load,
    },
  ];
};
export default useFormulaDb;
