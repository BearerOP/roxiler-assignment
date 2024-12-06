import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const chartVariants = cva(
  "relative w-full overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
        shadow: "chart-shadow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const ChartContext = React.createContext(null)

function ChartProvider({
  children,
  config,
  ...props
}) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div {...props} className={cn(chartVariants(props), props.className)}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}

const ChartContainer = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <ChartProvider ref={ref} {...props}>
      <div className={cn("w-full h-full", className)}>{children}</div>
    </ChartProvider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = React.forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 rounded-lg border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef(
  ({ className, indicator = "color", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] px-2 py-1.5 text-sm",
          className
        )}
        {...props}
      />
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center space-x-2.5 pt-2",
        className
      )}
      {...props}
    />
  )
})
ChartLegend.displayName = "ChartLegend"

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
}