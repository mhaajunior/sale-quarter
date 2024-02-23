import { Skeleton } from "antd";
import NotFound from "./NotFound";
import Denied from "./Denied";

interface Denied {
  isDenied: boolean;
  code?: number;
}

const SkeletonWrap = ({
  session,
  children,
  notFound = false,
  denied = { isDenied: false },
}: {
  session: any;
  children: React.ReactNode;
  notFound?: boolean;
  denied?: Denied;
}) => {
  const renderedPortal = () => {
    if (session === undefined) {
      return <Skeleton active />;
    } else {
      if (notFound) {
        return <NotFound />;
      }
      if (denied.isDenied) {
        return <Denied code={denied?.code} />;
      }
      return children;
    }
  };

  return <>{renderedPortal()}</>;
};

export default SkeletonWrap;
