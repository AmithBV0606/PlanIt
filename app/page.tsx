import CompanyCarousel from "@/components/company-carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar, ChevronRight, Layout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Intuitive Kanban Boards",
    description:
      "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
    icon: Layout,
  },
  {
    title: "Powerful Sprint Planning",
    description:
      "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
    icon: Calendar,
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain insights into your team's performance with detailed, customizable reports and analytics.",
    icon: BarChart,
  },
];

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

        <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto font-bold">
          Empower your team with our intuitive project management solution.
        </p>

        <Link href={"/onboarding"}>
          <Button size={"lg"} className="mr-4">
            Get Started <ChevronRight size={18} />
          </Button>
        </Link>

        <Link href={"#features"}>
          <Button size={"lg"} variant={"secondary"} className="mr-4">
            Learn more
          </Button>
        </Link>
      </section>

      {/* Key features */}
      <section className="bg-gray-900 py-20 px-5" id="features">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 mb-4 text-blue-500" />
                    <h4 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Trusted by Industry Leaders
          </h3>

          <CompanyCarousel />
        </div>
      </section>
    </div>
  );
}