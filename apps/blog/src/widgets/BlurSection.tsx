export const BlurSection = () => (
  <header
    className="py-10 w-full fixed left-0 opacity-75 z-50"
    style={{
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
      maskImage: "linear-gradient(to bottom, #000000 25%, transparent)",
    }}
  ></header>
);
