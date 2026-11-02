import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type Props = { id: string; label: string; hint: string; children: ReactNode };

const SettingRow = ({ id, label, hint, children }: Props) => (
    <div className="flex items-center justify-between gap-4 py-3">
        <div className="flex flex-col gap-1">
            <Label htmlFor={id} className="text-[15px] font-semibold">{label}</Label>
            <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        {children}
    </div>
);

export default SettingRow;
