export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center absolute bg-[#111111] inset-0 z-50">
      <h1 className="text-black dark:text-white font-black text-3xl animate-pulse">
        scout machine
      </h1>
      <p className="text-xs text-lightGray mt-1">processing...</p>
    </div>
  );
};
