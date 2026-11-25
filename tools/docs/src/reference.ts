/** The generated reference: `packages/ui-react/docs/props.json` and `types.json`. An unknown name throws. */
import propsJson from "../../../packages/ui-react/docs/props.json";
import typesJson from "../../../packages/ui-react/docs/types.json";
import type { ComponentDoc, PropsJson, TypeDoc, TypesJson } from "./types.js";

const all: PropsJson = propsJson;
const allTypes: TypesJson = typesJson;

/** One type export, from `types.json`. */
export function typeOf(name: string): TypeDoc {
  const doc = allTypes[name];
  if (doc === undefined) throw new Error(`type ${name}: not in types.json`);
  return doc;
}

/** The doc of one component or helper, from `props.json`. */
export function docOf(name: string): ComponentDoc {
  const doc = all[name];
  if (doc === undefined) throw new Error(`${name}: not in props.json`);
  return doc;
}
