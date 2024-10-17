"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "../../lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-7 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-blue-500 data-[state=checked]:via-blue-600 data-[state=checked]:to-blue-700 data-[state=unchecked]:bg-zinc-200/20 dark:focus-visible:ring-zinc-300 dark:focus-visible:ring-offset-zinc-950 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=unchecked]:bg-zinc-800",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block size-[1.35rem] rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-[0.2rem] dark:bg-zinc-950"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
