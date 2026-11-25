import { cn } from "./cn";

export const a = <div className="bg-slate-800">a</div>; // expect: uislash/raw-colour
export const b = <p className="hover:text-violet-700">b</p>; // expect: uislash/raw-colour
export const c = <p className="bg-[#1e1e2e]">c</p>; // expect: uislash/raw-colour
export const d = (on: boolean) => <i className={`p-2 ${on ? "bg-slate-100" : ""}`} />; // expect: uislash/raw-colour
export const e = <i className={cn("p-2", "text-red-500")} />; // expect: uislash/raw-colour
