import { DB_INVENTORY } from "@/const/indexedDBNames";
import { useIndexedDB } from "react-indexed-db-hook";

export default () => useIndexedDB(DB_INVENTORY);
