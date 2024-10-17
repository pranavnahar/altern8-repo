"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "../../lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <div className={cn(
    orientation === "vertical" && "ml-3",
    orientation === "horizontal" && "pt-3"
  )}>
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
        "h-3 flex-col border-t border-t-transparent pr-[2px] pl-[2px] pt-[1px] pb-[1.5px] bg-neutral-200/5 rounded-full cursor-pointer",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-neutral-200/20 dark:bg-neutral-800" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  </div>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
