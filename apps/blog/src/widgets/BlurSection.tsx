"use client";

export const BlurSection = () => {
  const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header
      className="py-10 w-full fixed left-0 opacity-75 z-50 hover:cursor-pointer"
      style={{
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        maskImage: "linear-gradient(to bottom, #000000 25%, transparent)",
      }}
      onClick={handleClick}
    />
  );
};
