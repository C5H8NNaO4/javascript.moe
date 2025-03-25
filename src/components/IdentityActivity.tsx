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
          wrapperClsn="fixed right-2 top-2"
          className="bg-green-500"
          label={used}
        ></Chip>,
        document.body
      );
};
