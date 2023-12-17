"use client";

import * as React from "react";
import Link from "next/link";
import strings from "@/lib/strings";

import { cn } from "@/lib/utils";
import {
  StarFilledIcon,
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

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Time API",
    href: "/time",
    description: "A simple endpoint that returns the current time.",
  },
  {
    title: "Privacy Policy",
    href: "/privacy",
    description: "Outlines how we handle your data and privacy.",
  },
];

export function Navigation() {
  return (
    <NavigationMenu className="mx-auto my-2">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <HomeIcon className="h-4 w-4" />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>GPTs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[376px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b select-none from-muted/50 to-muted p-6 no-underline focus:shadow-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    href="/listing#featured"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      <StarFilledIcon className="mx-auto mb-4 h-6 w-6" />
                      Custom Prompted AI Agents
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Engineered for Work, Chat, &amp; Art
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/listing#work" title="Work">
                <BackpackIcon className="h-4 w-4" />
                Domain experts for your work
              </ListItem>
              <ListItem href="/listing#chat" title="Chat">
                <ChatBubbleIcon className="h-4 w-4" />
                Guided conversations with AI
              </ListItem>
              <ListItem href="/listing#art" title="Art">
                <Pencil2Icon className="h-4 w-4" />
                Unique styles for your art
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Demos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[376px] gap-3 p-4 md:grid-cols-2">
              {components.map((component) => (
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
        <NavigationMenuItem>
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
