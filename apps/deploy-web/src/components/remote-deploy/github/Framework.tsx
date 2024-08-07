import React, { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Spinner } from "@akashnetwork/ui/components";
import { Globe } from "iconoir-react";

import { ServiceType } from "@src/types";
import { usePackageJson } from "../api/api";
import { removeInitialUrl } from "../utils";
const frameworks = [
  {
    title: "React",
    value: "react",
    image: "https://static-00.iconduck.com/assets.00/react-icon-512x456-2ynx529a.png"
  },
  {
    title: "Vue",
    value: "vue",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Vue.js_Logo.svg/1200px-Vue.js_Logo.svg.png"
  },
  {
    title: "Angular",
    value: "angular",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1200px-Angular_full_color_logo.svg.png"
  },
  {
    title: "Svelte",
    value: "svelte",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1200px-Svelte_Logo.svg.png"
  },
  {
    title: "Next.js",
    value: "next",
    image: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/nextjs-icon.png"
  },

  {
    title: "Astro",
    value: "astro",
    image: "https://icon.icepanel.io/Technology/png-shadow-512/Astro.png"
  },
  {
    title: "Other",
    value: "other"
  }
];
const Framework = ({ services }: { services: ServiceType[] }) => {
  const [data, setData] = useState<any>(null);
  const selected = removeInitialUrl(services?.[0]?.env?.find(e => e.key === "REPO_URL")?.value);
  const { isLoading } = usePackageJson(selected ?? "", (data: any) => {
    setData(data);
  });

  return (
    <div className="col-span-2 flex flex-col gap-5 rounded border bg-card px-6 py-6 text-card-foreground">
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold">Build Framework</h1>
      </div>

      <Select
        disabled={true}
        value={
          data?.scripts?.dev?.includes("next")
            ? "next"
            : data?.scripts?.dev?.includes("vue")
              ? "vue"
              : data?.scripts?.dev?.includes("astro")
                ? "astro"
                : data?.scripts?.dev?.includes("svelte")
                  ? "svelte"
                  : data?.scripts?.dev?.includes("angular")
                    ? "angular"
                    : data?.scripts?.dev?.includes("react")
                      ? "react"
                      : "other"
        }
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            {isLoading && <Spinner size="small" />}
            <SelectValue placeholder={"Select "} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {frameworks.map(framework => (
              <SelectItem key={framework.value} value={framework.value}>
                <div className="flex items-center">
                  {framework.image ? <img src={framework.image} alt={framework.title} className="mr-2 h-6 w-6" /> : <Globe className="mr-2" />}
                  {framework.title}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Framework;
