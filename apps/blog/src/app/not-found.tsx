import { Separator } from "@/components/ui";
import { SITE_CONFIG } from "@/config";
import { Header } from "@/widgets/Header";
import { SocialLinkSection } from "@/widgets/SocialLinkSection";
import { GeistMono } from "geist/font/mono";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className=" mx-auto max-w-xl py-8 pt-20 text-gray-700 dark:text-gray-300 px-2">
      <Header className=""></Header>

      <section className="animate-[fadeInDown_0.5s_200ms_forwards] opacity-0">
        <SocialLinkSection />

        <Separator className="my-8" />

        <h1 style={GeistMono.style} className=" mt-20 mb-10 font-extralight">
          <span className="text-4xl">404</span> Not Found
        </h1>

        <Link href={SITE_CONFIG.owner.github} className="text-sm underline hover:text-secondary-md">
          온 김에 깃허브 구경가기
        </Link>
      </section>
    </div>
  );
};

export default NotFound;
