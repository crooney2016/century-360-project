"use client";
import * as React from "react";
import { cn } from "./cn";
import { Input } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

export type Option = { label: string; value: string };

export type MultiSelectProps = {
  buttonLabel: string;
  options: ReadonlyArray<Option>;
  value: ReadonlyArray<string>;
  onChange: (next: ReadonlyArray<string>) => void;
  className?: string;
  maxHeight?: number;
};

export function MultiSelect(props: MultiSelectProps): React.JSX.Element {
  const { buttonLabel, options, value, onChange, className, maxHeight = 320 } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [q, setQ] = React.useState<string>("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selected = React.useMemo(() => new Set(value), [value]);

  const filtered = React.useMemo(() => {
    if (!q) return options;
    const needle = q.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(needle));
  }, [options, q]);

  const toggle = React.useCallback(
    (v: string) => {
      const next = new Set(selected);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      onChange(Array.from(next));
    },
    [onChange, selected]
  );

  const all = filtered.map(o => o.value);
  const allOn = all.length > 0 && all.every(v => selected.has(v));
  const someOn = all.some(v => selected.has(v)) && !allOn;

  const setAll = React.useCallback(
    (checked: boolean) => {
      onChange(
        checked ? Array.from(new Set([...value, ...all])) : value.filter(v => !all.includes(v))
      );
    },
    [all, onChange, value]
  );

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const countLabel = value.length === 0 ? "All" : `${value.length} selected`;

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <Button variant="outline" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        {buttonLabel}: {countLabel}
      </Button>
      {open && (
        <div className="absolute z-[9999] p-2 mt-1 bg-white border rounded-lg shadow-lg w-72">
          <div className="mb-2">
            <Input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder={`Search ${buttonLabel.toLowerCase()}…`}
              className="w-full"
              onKeyDown={e => {
                if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
            />
          </div>

          <label className="flex items-center gap-2 mb-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={allOn}
              aria-label="Select all filtered options"
              ref={el => {
                if (el) el.indeterminate = someOn;
              }}
              onChange={e => setAll(e.currentTarget.checked)}
              className="cursor-pointer"
            />
            <span>Select all (filtered)</span>
          </label>

          <div
            className="overflow-auto border rounded-lg"
            style={{ maxHeight }}
            role="group"
            aria-label="Multi-select options"
          >
            {filtered.map(opt => {
              const on = selected.has(opt.value);
              return (
                <div
                  key={opt.value}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggle(opt.value)}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={e => {
                      e.stopPropagation();
                      toggle(opt.value);
                    }}
                    aria-label={opt.label}
                    className="cursor-pointer"
                  />
                  <span className="truncate" title={opt.label}>
                    {opt.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
