export default function Input(props: React.ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      className="w-full rounded-full bg-gray-800 px-6 py-2 text-white"
      type="text"
    />
  );
}
