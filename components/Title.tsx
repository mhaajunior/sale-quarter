const Title = ({
  children,
  title,
}: {
  children?: React.ReactNode;
  title: string;
}) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl">{title}</h1>
      {children}
    </div>
  );
};

export default Title;
