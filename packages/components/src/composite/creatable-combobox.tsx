"use client"
 
import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "../utilities"
import { Button } from "../ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"

interface Option {
  value: string
  label: string
  [key: string]: any
}

interface ComboboxCreatableProps {
  options: Option[]
  onChange?: (value: string) => void
  placeholder?: string
  groupBy?: string | ((item: Option) => string)
  value?: string
  className?: string
}

export function ComboboxCreatable({
  options: initialOptions,
  onChange,
  placeholder = "Select option...",
  groupBy,
  value: controlledValue,
  className,
}: ComboboxCreatableProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(controlledValue || "")
  const [options, setOptions] = React.useState(initialOptions)
  const [inputValue, setInputValue] = React.useState("")

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue)
    }
  }, [controlledValue])

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue
    setValue(newValue)
    setOpen(false)
    onChange?.(newValue)
  }

  const getGroupName = React.useCallback((option: Option): string => {
    if (!groupBy) return ""
    if (typeof groupBy === "function") return groupBy(option)
    return option[groupBy] || "Other"
  }, [groupBy])

  const handleCreate = () => {
    if (!inputValue) return
    const newOption = {
      value: inputValue.toLowerCase().replace(/\W/g, '-'),
      label: inputValue,
      // If groupBy is specified, add it to "Other" group
      ...(typeof groupBy === "string" && { [groupBy]: "Other" })
    }
    setOptions([...options, newOption])
    setValue(newOption.value)
    setOpen(false)
    onChange?.(newOption.value)
  }

  // Group options if groupBy is specified
  const groupedOptions = React.useMemo(() => {
    if (!groupBy) return { "": options }

    return options.reduce((groups: { [key: string]: Option[] }, option) => {
      const groupName = getGroupName(option)
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(option)
      return groups
    }, {})
  }, [options, groupBy, getGroupName])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("gap-8 justify-between", className)}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)} align="start">
        <Command>
          <CommandInput 
            placeholder="Search..." 
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={handleCreate}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create "{inputValue}"
              </Button>
            </CommandEmpty>
            {Object.entries(groupedOptions).map(([group, groupOptions], index) => (
              <React.Fragment key={group}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={group || undefined}>
                  {groupOptions
                    .filter(option => 
                      option.label.toLowerCase().includes(inputValue.toLowerCase())
                    )
                    .map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={handleSelect}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
              </React.Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
