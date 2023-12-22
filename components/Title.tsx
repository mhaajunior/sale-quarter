import React, { PropsWithChildren } from "react";

const Title = ({ children }: PropsWithChildren) => {
  return <div className="text-3xl">{children}</div>;
};

export default Title;
