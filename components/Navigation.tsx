// components/Navigation.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import strings from "@/lib/strings";

import { cn } from "@/utils/cn";
import {
  StarIcon,
  HomeIcon,
  BackpackIcon,
  ChatBubbleIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./ui/mode-toggle";

const demos: { title: string; href: string; description: string }[] = [
  {
    title: "Time API",
    href: "/time",
    description: "Endpoint that returns the current time",
  },
  {
    title: "OpenAI API Moderator",
    href: "https://github.com/benmcnulty/moderator",
    description: "GitHub repo implementing OpenAI Moderation API",
  },
];

const links: { title: string; href: string; description: string }[] = [
  {
    title: "Blog",
    href: "/blog",
    description:
      "Latest News & Articles on our Custom GPTs & Prompt Engineering",
  },
  {
    title: "About",
    href: "/about",
    description: "About us and our mission",
  },
  {
    title: "Privacy Policy",
    href: "/privacy",
    description: "Outlines how we handle your data",
  },
];

export function Navigation() {
  return (
    <NavigationMenu className="mx-auto my-2">
      <NavigationMenuList>
        <NavigationMenuItem className="custom-nav-item">
          <NavigationMenuLink asChild>
            <Link href="/" className={navigationMenuTriggerStyle()}>
              <HomeIcon className="h-4 w-4" />
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="custom-nav-item">
          <NavigationMenuTrigger>GPTs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[100%] sm:w-[22.4rem] grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link href="/listing?filter=featured" className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b select-none from-muted/50 to-muted p-6 no-underline focus:shadow-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Featured AI Agents
                    </div>
                    <StarIcon className="mx-auto my-4 h-8 w-8" />
                    <p className="text-sm leading-tight text-muted-foreground mb-6">
                      GPTs Engineered for Work, Chat, &amp; Art
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/listing?filter=work" title="Work">
                Domain experts
                <BackpackIcon className="h-5 w-5 mx-auto mt-2 mb-1" />
              </ListItem>
              <ListItem href="/listing?filter=chat" title="Chat">
                Guided conversations
                <ChatBubbleIcon className="h-5 w-5 mx-auto mt-2 mb-1" />
              </ListItem>
              <ListItem href="/listing?filter=art" title="Art">
                Unique styles
                <Pencil2Icon className="h-5 w-5 mx-auto mt-2 mb-1" />
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="custom-nav-item">
          <NavigationMenuTrigger>Demos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[100%] sm:w-[22.4rem]">
              {demos.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="custom-nav-item">
          <NavigationMenuTrigger>More</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[100%] sm:w-[22.4rem]">
              {links.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="custom-nav-item">
          <div className="rounded-md bg-card shaded-button">
            <ModeToggle />
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { href: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
