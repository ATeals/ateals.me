export const siteConfig = {
  domain:
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://blog.ateals.me",
  title: "Blog | Ateals",
  description: "Ateals의 블로그입니다.",
  icons: "/favicon.ico",
  image: "/images/main.webp",
};
