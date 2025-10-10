import { cn } from "@/lib/utils";
import { CheckIcon, CircleIcon } from "lucide-react";
import React, { type ReactNode } from "react";

type ListItemProps = {
  children: ReactNode;
  icon?: "check" | "circle" | "number" | "none";
  index?: number;
  className?: string;
};

type ListStyleType = "disc" | "circle" | "check" | "number" | "none";

type StylishListProps = {
  children: ReactNode | ReactNode[];
  type?: ListStyleType;
  className?: string;
  gap?: "tight" | "normal" | "loose";
};

export function StylishListItem({
  children,
  icon = "none",
  index,
  className,
}: ListItemProps) {
  const renderIcon = () => {
    switch (icon) {
      case "check":
        return (
          <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
        );
      case "circle":
        return (
          <span className="mr-2 flex h-5 w-5 items-center justify-center">
            <CircleIcon className="h-1.5 w-1.5 fill-current" />
          </span>
        );
      case "number":
        return (
          <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            {index}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <li className={cn("flex items-start", className)}>
      {renderIcon()}
      <div className="flex-1">{children}</div>
    </li>
  );
}

export function StylishList({
  children,
  type = "disc",
  className,
  gap = "normal",
}: StylishListProps) {
  // Convert children to array to handle both single and multiple children
  const childrenArray = React.Children.toArray(children);

  // Apply spacing based on the gap prop
  const gapClasses = {
    tight: "space-y-1",
    normal: "space-y-2",
    loose: "space-y-4",
  };

  // Apply the right list type
  const listTypeClasses = {
    disc: "", // We'll handle disc styling with the StylishListItem
    circle: "", // Same for circle
    check: "", // Same for check
    number: "", // Same for numbers
    none: "list-none", // Only "none" is applied directly to the ul
  };

  return (
    <ul
      className={cn("my-6", gapClasses[gap], listTypeClasses[type], className)}
    >
      {childrenArray.map((child, index) => {
        // If child is already a StylishListItem, just clone it with the index
        if (React.isValidElement(child) && child.type === StylishListItem) {
          return React.cloneElement(
            child as React.ReactElement<ListItemProps>,
            {
              index: index + 1,
            },
          );
        }

        // Otherwise, wrap it in a StylishListItem with appropriate icon
        let icon: "check" | "circle" | "number" | "none" = "none";
        switch (type) {
          case "check":
            icon = "check";
            break;
          case "circle":
            icon = "circle";
            break;
          case "number":
            icon = "number";
            break;
          case "disc":
            icon = "circle"; // Use circle for disc style for simplicity
            break;
          default:
            icon = "none";
        }

        return (
          <StylishListItem key={index} icon={icon} index={index + 1}>
            {child}
          </StylishListItem>
        );
      })}
    </ul>
  );
}
