interface ContainerProps {
  children?: React.ReactNode;
}

export default function Table({ children }: ContainerProps) {
  return (
    <div className="relative flex aspect-[1/2] items-center justify-center rounded-full border-[24px] border-gray-950 bg-[radial-gradient(var(--tw-gradient-stops))] from-green-500 to-green-700 p-12 before:pointer-events-none before:absolute before:inset-4 before:rounded-full before:border before:border-green-400 md:aspect-[2/1] md:min-h-80 lg:min-h-96 ">
      {children}
    </div>
  );
}
