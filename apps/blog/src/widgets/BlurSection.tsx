"use client";

export const BlurSection = () => {
  const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className=" group/blurSection py-10 w-full fixed left-0 opacity-75 z-50 hover:cursor-pointer"
      style={{
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        maskImage: "linear-gradient(to bottom, #000000 25%, transparent)",
      }}
      onClick={handleClick}
    >
      <div className="w-full hidden justify-center animate-bounce group-hover/blurSection:flex">
        <div className="w-10 h-10 bg-white dark:bg-dark-bg rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
