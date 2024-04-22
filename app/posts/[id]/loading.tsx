export default function Loading() {
  return (
    <div className="p-5 text-white gap-2 flex flex-col *:animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-neutral-700 size-7 rounded-full" />
        <div className="gap-2 flex flex-col">
          <div className="bg-neutral-700 h-3 w-40" />
          <div className="bg-neutral-700 h-2 w-40" />
        </div>
      </div>
      <div className="bg-neutral-700 h-6 w-40" />
      <div className="bg-neutral-700 h-5 w-40" />
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <div className="bg-neutral-700 size-5 rounded-full" />
          <div className="bg-neutral-700 h-3 w-32" />
        </div>
        <div className="bg-neutral-700 h-5 w-40 rounded-2xl" />
      </div>
      <div className="bg-neutral-700 h-8 w-full my-4" />
      {[...Array(10)].map((_, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <div className="bg-neutral-700 size-7 rounded-full" />
          <div className="gap-2 flex flex-col">
            <div className="bg-neutral-700 h-3 w-40" />
            <div className="bg-neutral-700 h-2 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}
