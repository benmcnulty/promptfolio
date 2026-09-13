'use client';

import { usePathname } from "next/navigation";
import { ViewTransition } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
      <div className="route-content">{children}</div>
    </ViewTransition>
  );
}
