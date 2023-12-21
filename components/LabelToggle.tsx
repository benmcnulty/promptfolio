// components/LabelToggle.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  StarIcon,
  BackpackIcon,
  ChatBubbleIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";

const labelIcons = {
  featured: StarIcon,
  work: BackpackIcon,
  chat: ChatBubbleIcon,
  art: Pencil2Icon,
};

export function LabelToggle() {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter");
  const pathname = usePathname();

  useEffect(() => {
    // Handle multiple filters from the URL
    if (initialFilter) {
      const filters = initialFilter.split(",");
      setSelectedLabels(filters);
    }
  }, [initialFilter]);

  const toggleLabel = (label: string) => {
    const updatedLabels = selectedLabels.includes(label)
      ? selectedLabels.filter((l) => l !== label)
      : [...selectedLabels, label];
    setSelectedLabels(updatedLabels);

    const params = new URLSearchParams();
    if (updatedLabels.length > 0) {
      params.set("filter", updatedLabels.join(","));
    }
    router.replace(pathname + "?" + params.toString(), { scroll: false });
  };

  return (
    <div className="flex flex-wrap md:flex-nowrap justify-center gap-2 md:gap-4 my-4">
      {Object.entries(labelIcons).map(([label, Icon]) => (
        <button
          key={label}
          className={`flex w-[calc(50%-0.5rem)] items-center justify-center space-x-2 md:px-4 rounded-md p-2 border border-muted transition-colors ${
            selectedLabels.includes(label) ? "bg-accent" : "bg-muted"
          } toggle-hover-effect`}
          onClick={() => toggleLabel(label)}
        >
          <Icon className="h-6 w-6" />
          <span className="text-sm font-medium">
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </span>
        </button>
      ))}
    </div>
  );
}
