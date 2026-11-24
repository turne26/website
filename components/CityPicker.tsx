"use client";
/*
 * Searchable city field. Type a few letters, pick from Indian cities (old names work too:
 * "Bangalore" finds Bengaluru), or keep exactly what you typed if your town isn't listed.
 * Works controlled (value + onChange) or uncontrolled (the waitlist form reads #city's value).
 */
import { useId, useMemo, useRef, useState, type InputHTMLAttributes } from "react";
import { canonicalCity, searchCities } from "@/lib/cities";

type Props = {
  id: string;
  name?: string;
  value?: string;
  onChange?: (city: string) => void;
  placeholder?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "id" | "name">;

export function CityPicker({ id, name = "city", value, onChange, placeholder = "Start typing your city", className = "input", ...rest }: Props) {
  const [own, setOwn] = useState("");
  const text = value ?? own;
  const setText = (t: string) => { if (value === undefined) setOwn(t); onChange?.(t); };
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchCities(text, 8), [text]);
  const typed = text.trim();
  const exact = results.some((c) => c.name.toLowerCase() === typed.toLowerCase());
  // Options: matching cities, then "Use what I typed" when it isn't an exact match.
  const options = [...results.map((c) => ({ key: c.name + c.state, label: c.name, hint: c.state, value: c.name })),
    ...(typed.length >= 2 && !exact ? [{ key: "__typed", label: `Use “${typed}”`, hint: "Not in the list", value: typed }] : [])];

  const choose = (v: string) => { setText(v); setOpen(false); };

  return (
    <div className="city-picker">
      <input
        {...rest}
        ref={input}
        id={id}
        name={name}
        className={className}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open && options.length > 0}
        aria-controls={listId}
        aria-activedescendant={open && options[active] ? `${listId}-${active}` : undefined}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        value={text}
        onChange={(e) => { setText(e.target.value); setOpen(true); setActive(0); }}
        onFocus={() => { setOpen(true); setActive(0); }}
        onBlur={() => { setOpen(false); if (typed) setText(canonicalCity(typed)); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, options.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          else if (e.key === "Enter" && open && options[active] && typed) { e.preventDefault(); choose(options[active].value); }
          else if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && options.length > 0 && (
        <ul className="city-list" id={listId} role="listbox" aria-label="Cities">
          {!typed && <li className="city-list__head" aria-hidden="true">Popular cities</li>}
          {options.map((o, i) => (
            <li key={o.key} id={`${listId}-${i}`} role="option" aria-selected={i === active}
              className={i === active ? "is-active" : undefined}
              onMouseDown={(e) => { e.preventDefault(); choose(o.value); }}
              onMouseEnter={() => setActive(i)}>
              <b>{o.label}</b><span>{o.hint}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
