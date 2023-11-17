// app/time/layout.tsx
import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
};

export default Layout;
