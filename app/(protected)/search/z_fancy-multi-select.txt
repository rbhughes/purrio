"use client";

// see original: https://craft.mxkaske.dev/post/fancy-box
// 2024-03-11 | from a branch that adds the onChange prop to FancyMultiSelect
// https://github.com/shadcn-ui/ui/blob/7551f36e65c8346f554d6d2061c24125e2c6ceec/apps/www/registry/default/example/multi-select-form.tsx

// (if this gets annoying, just switch to: https://react-select.com/home)

// 2024-04-05 | wrapped stuff in CommandList
//  cmdk css bugs (select, dropdown-menu, command)
//  https://github.com/shadcn-ui/ui/pull/3037
//  https://github.com/shadcn-ui/ui/issues/3024
//  https://github.com/shadcn-ui/ui/pull/2945

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Item = Record<"value" | "label", string>;

interface FancyProps {
  items: Item[];
  onChange?: (values: { value: string; label: string }[]) => void;
  selected: Item[];
  setSelected: React.Dispatch<React.SetStateAction<Item[]>>;
}

export function FancyMultiSelect({
  onChange,
  items,
  selected,
  setSelected,
}: FancyProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  //const [selected, setSelected] = React.useState<Item[]>([items[0]]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((item: Item) => {
    setSelected((prev) => prev.filter((s) => s.value !== item.value));
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    []
  );

  //const selectables = items.filter((item) => !selected.includes(item));
  const selectables = items.filter((item) => {
    return !selected.some((selectedItem) => {
      return JSON.stringify(item) === JSON.stringify(selectedItem);
    });
  });

  React.useEffect(() => {
    onChange?.(selected);
  }, [selected]);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((item) => {
            return (
              <Badge key={item.value} variant="secondary">
                {item.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select assets..."
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((item) => {
                  return (
                    <CommandItem
                      key={item.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue("");
                        setSelected((prev) => [...prev, item]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {item.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
