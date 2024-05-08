const Title = ({
  children,
  title,
  addon,
}: {
  children?: React.ReactNode;
  title: string | React.ReactNode;
  addon?: React.ReactNode;
}) => {
  // hi
  return (
    <div className="flex flex-col gap-2 mb-10">
      <div className="flex flex-wrap-reverse items-center justify-between">
        <h1 className="text-3xl">{title}</h1>
        <div className="ml-auto">{addon}</div>
      </div>
      {children}
    </div>
  );
};

export default Title;
