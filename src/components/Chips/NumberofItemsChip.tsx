import { Chip } from "../Chip";

export const NumberOfItemsChip = ({ items }: { items: number }) => {
  return <Chip icon="FaFlask" className="bg-blue-500" label={items} />;
};
