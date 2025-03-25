import { useIdentity } from "@/lib/hooks/useIdentity";
import { Chip } from "./Chip";
import ReactDOM from "react-dom";

export const IdentityActivity = () => {
  const { used } = useIdentity();
  return !used
    ? null
    : ReactDOM.createPortal(
        <Chip
          icon="FaFingerprint"
          className="bg-green-500 absolute right-2 top-2"
          label={used}
        ></Chip>,
        document.body
      );
};
