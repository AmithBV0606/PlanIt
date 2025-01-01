import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
          Streamline Your Workflow
          <span className="flex mx-auto gap-3 sm:gap-4 items-center">
            with{" "}
            <Image
              src={"/PlanIt.png"}
              alt="PlanIt Logo"
              width={200}
              height={100}
              className="h-15 sm:h-24 w-auto object-contain"
            />
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto font-bold">Empower your team with our intuitive project management solution.</p>

        <Link href={"/onboarding"}>
          <Button size={"lg"} className="mr-4">
            Get Started <ChevronRight size={18}  />
          </Button>
        </Link>

        <Link href={"#features"}>
          <Button size={"lg"} variant={"secondary"} className="mr-4">
            Learn more
          </Button>
        </Link>
      </section>
    </div>
  );
}