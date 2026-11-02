import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateSettings, type Settings } from "@/lib/store/settings";

type Props<K extends Exclude<keyof Settings, "shortcut">> = {
    name: K;
    value: Settings[K];
    options: Record<Settings[K], string>;
};

/** A select bound to one setting; `id` matches the SettingRow label. */
const SettingSelect = <K extends Exclude<keyof Settings, "shortcut">>({ name, value, options }: Props<K>) => (
    <Select
        items={options}
        value={value}
        onValueChange={(v) => v && updateSettings({ [name]: v } as Partial<Settings>)}
    >
        <SelectTrigger id={name} className="w-40 shrink-0 rounded-none bg-background">
            <SelectValue />
        </SelectTrigger>
        <SelectContent className="frame rounded-none">
            {Object.entries(options).map(([v, label]) => (
                <SelectItem key={v} value={v}>
                    {label as string}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);

export default SettingSelect;
