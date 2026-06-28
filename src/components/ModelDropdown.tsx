export type ModelOption = {
  value: string;
  label: string;
};

type Props = {
  options: ModelOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function ModelDropdown({
  options,
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-slate-300">Model</span>
      <select
        className="h-9 px-3 rounded-lg bg-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-black">
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}


