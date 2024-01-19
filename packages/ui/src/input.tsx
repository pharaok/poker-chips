export default function Input(props: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      className="h-8 w-full rounded-full bg-gray-800 p-2 text-white"
      type="text"
    />
  );
}
