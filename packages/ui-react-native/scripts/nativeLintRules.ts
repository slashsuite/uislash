/**
 * The native lint rules: what the resolver and React Native cannot catch until a screen renders on
 * a device. Each rule reads one source file as text and returns its findings, so a planted bad
 * fixture (`scripts/fixtures/`) proves it fires.
 *
 * - `bare-text`: text written straight inside a `View` (or `Pressable`, `ScrollView`). React Native
 *   throws on it at render; text goes through `Text` or `renderText`.
 * - `unresolved-class`: a class string written as a literal in `useStyles("…")` or `resolve("…")`
 *   that does not resolve in every theme. The resolver throws on an unknown class at runtime; this
 *   finds it before a device does.
 * - `colour-literal`: a hex, `rgb()` or `hsl()` colour in a component. Colours come only from a
 *   theme's `<id>.native.json`, as on the web they come only from a theme's CSS.
 * - `stylesheet`: `StyleSheet.create` in a component. Styles come from core's tables through
 *   `useStyles`, never a local sheet, which is the drift the shared tables exist to prevent.
 */
import type { NativeTheme } from "@slashsuite/core";
import ts from "typescript";
import { resolve } from "../src/theme/resolve.js";

export type Finding = { rule: string; line: number; message: string };

const CONTAINERS = new Set([
  "View",
  "Pressable",
  "ScrollView",
  "SafeAreaView",
  "KeyboardAvoidingView",
]);

function lineOf(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

/**
 * Text a container would throw on: JSX text, or a string or template literal in braces. A string
 * held in a variable (`{label}`) needs the type checker and is out of reach of this rule.
 */
function bare(child: ts.JsxChild): boolean {
  if (ts.isJsxText(child)) return child.text.trim() !== "";
  const value = ts.isJsxExpression(child) ? child.expression : undefined;
  return (
    value !== undefined &&
    (ts.isStringLiteral(value) ||
      ts.isNoSubstitutionTemplateLiteral(value) ||
      ts.isTemplateExpression(value))
  );
}

/** Bare text that is a direct child of a container element. */
export function bareText(source: string): Finding[] {
  const findings: Finding[] = [];
  const file = ts.createSourceFile(
    "lint.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const visit = (node: ts.Node): void => {
    const tag = ts.isJsxElement(node) ? node.openingElement.tagName.getText(file) : "";
    const texts = ts.isJsxElement(node) && CONTAINERS.has(tag) ? node.children : [];
    for (const child of texts.filter((each) => bare(each))) {
      findings.push({
        rule: "bare-text",
        line: file.getLineAndCharacterOfPosition(child.getStart(file)).line + 1,
        message: `text ${child.getText(file).trim()} inside <${tag}>: wrap it in <Text> or renderText`,
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return findings;
}

export function unresolvedClass(source: string, themes: NativeTheme[]): Finding[] {
  const findings: Finding[] = [];
  for (const match of source.matchAll(/\b(?:useStyles|resolve)\(\s*(["'])([^"'\n]*)\1/g)) {
    for (const theme of themes) {
      try {
        resolve(match[2] ?? "", theme);
      } catch (error) {
        findings.push({
          rule: "unresolved-class",
          line: lineOf(source, match.index),
          message: `${theme.id}: ${error instanceof Error ? error.message : String(error)}`,
        });
        break;
      }
    }
  }
  return findings;
}

export function colourLiteral(source: string): Finding[] {
  const findings: Finding[] = [];
  for (const match of source.matchAll(/["'`](#[0-9a-fA-F]{3,8}|(?:rgb|rgba|hsl|hsla)\()/g)) {
    findings.push({
      rule: "colour-literal",
      line: lineOf(source, match.index),
      message: `colour ${match[1]}: read it from the theme`,
    });
  }
  return findings;
}

export function stylesheet(source: string): Finding[] {
  return [...source.matchAll(/\bStyleSheet\.create\b/g)].map((match) => ({
    rule: "stylesheet",
    line: lineOf(source, match.index),
    message: "StyleSheet.create: take styles from core's tables through useStyles",
  }));
}

export function lintSource(source: string, themes: NativeTheme[]): Finding[] {
  return [
    ...bareText(source),
    ...unresolvedClass(source, themes),
    ...colourLiteral(source),
    ...stylesheet(source),
  ].toSorted((a, b) => a.line - b.line);
}
