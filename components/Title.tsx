const Title = ({
  children,
  title,
  addon,
}: {
  children?: React.ReactNode;
  title: string | React.ReactNode;
  addon?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-2 mb-10">
      <div className="flex  items-center justify-between">
        <h1 className="text-3xl">{title}</h1>
        {addon}
      </div>
      {children}
    </div>
  );
};

export default Title;
