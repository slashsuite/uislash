import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { device, Linking } from "../../test/react-native.js";
import { nativeThemes } from "../../test/themes.js";
import { ThemeProvider } from "../theme/ThemeProvider.js";
import { a11y } from "./a11y.js";
import { pressProps, valueProps } from "./events.js";
import { Icon, ToneContext } from "./icon.js";
import { breakpointOf, Cluster, columnsFor, Stack, useBreakpoint } from "./layout.js";
import { follow, isExternal, linkHost } from "./link.js";
import { hitSlopFor, withinPixel } from "./metrics.js";
import { Overlay, scrimColour, useOverlay } from "./overlay.js";
import { MAX_FONT_SCALE, renderText, TextStyleProvider } from "./text.js";

const theme = nativeThemes[0];
if (theme === undefined) throw new Error("no theme");
const styleOf = (element: Element): Record<string, unknown> =>
  JSON.parse(element.getAttribute("data-style") ?? "{}") as Record<string, unknown>;

describe("F2 text", () => {
  it("wraps a bare string in a Text that takes the style handed down, capped at the font scale", () => {
    render(
      <TextStyleProvider style={{ color: "#111", fontSize: 14 }}>
        <TextStyleProvider style={{ fontSize: 16 }}>
          {renderText(["Hello", " there"])}
        </TextStyleProvider>
      </TextStyleProvider>,
    );
    const text = screen.getByText("Hello");
    expect(styleOf(text)).toEqual({ color: "#111", fontSize: 16 });
    expect(text.getAttribute("data-max-scale")).toBe(String(MAX_FONT_SCALE));
  });

  it("passes an element through as it is", () => {
    const element = <b key="b">bold</b>;
    expect(renderText(element)).toBe(element);
  });
});

describe("F3 layout", () => {
  it("reads the web's breakpoints", () => {
    expect(breakpointOf(390)).toBe("base");
    expect(breakpointOf(640)).toBe("sm");
    expect(breakpointOf(800)).toBe("md");
    expect(breakpointOf(1024)).toBe("lg");
  });

  it("fits as many columns as the width allows, at least one", () => {
    expect(columnsFor(390, 160, 16)).toBe(2);
    expect(columnsFor(100, 160, 16)).toBe(1);
    expect(columnsFor(1024, 240, 24)).toBe(3);
  });

  it("follows the window", () => {
    device.width = 800;
    function Probe() {
      return <>{useBreakpoint()}</>;
    }
    render(<Probe />);
    expect(screen.getByText("md")).toBeDefined();
    device.width = 390;
  });

  it("lays a Stack out as a column and a Cluster as a wrapping row, on the gap scale", () => {
    render(
      <>
        <Stack gap="lg">one</Stack>
        <Cluster>two</Cluster>
      </>,
    );
    const stack = screen.getByText("one").parentElement;
    const cluster = screen.getByText("two").parentElement;
    if (stack === null || cluster === null) throw new Error("no parent");
    expect(styleOf(stack)).toEqual({ flexDirection: "column", gap: 24 });
    expect(styleOf(cluster)).toMatchObject({ flexDirection: "row", flexWrap: "wrap", gap: 12 });
  });
});

describe("F4 links", () => {
  it("opens an external address in the system and hands an internal one to the router", () => {
    const navigate = vi.fn();
    follow("https://example.com", navigate);
    follow("/orders/7", navigate);
    expect(Linking.opened).toContain("https://example.com");
    expect(navigate).toHaveBeenCalledWith("/orders/7");
    expect(isExternal("mailto:a@b.c")).toBe(true);
    expect(() => follow("/x", null)).toThrow(/LinkProvider/);
  });

  it("renders an inline link as text and a block link as a pressable", () => {
    expect(linkHost("inline")).toBe("text");
    expect(linkHost("block")).toBe("pressable");
  });
});

describe("F5 overlays", () => {
  it("opens over the theme's scrim, and a part inside closes it", () => {
    const onClose = vi.fn();
    function Close() {
      const { close } = useOverlay();
      return (
        <button type="button" onClick={close}>
          Done
        </button>
      );
    }
    render(
      <ThemeProvider theme={theme}>
        <Overlay open onClose={onClose} closeLabel="Close">
          <Close />
        </Overlay>
      </ThemeProvider>,
    );
    const scrim = screen.getByLabelText("Close");
    expect(styleOf(scrim).backgroundColor).toBe(scrimColour(theme.states.scrim));
    fireEvent.click(screen.getByText("Done"));
    fireEvent.click(scrim);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("renders nothing while closed", () => {
    render(
      <ThemeProvider theme={theme}>
        <Overlay open={false} onClose={() => undefined} closeLabel="Close">
          inside
        </Overlay>
      </ThemeProvider>,
    );
    expect(screen.queryByText("inside")).toBeNull();
  });
});

describe("F6 icons", () => {
  function Glyph(props: { width?: number; height?: number; color?: string }) {
    return <i data-testid="glyph" data-props={JSON.stringify(props)} />;
  }
  const propsOf = () =>
    JSON.parse(screen.getByTestId("glyph").getAttribute("data-props") ?? "{}") as unknown;

  it("gives the icon its size and the text colour in force", () => {
    render(
      <TextStyleProvider style={{ color: "#123456" }}>
        <Icon size="sm">
          <Glyph />
        </Icon>
      </TextStyleProvider>,
    );
    expect(propsOf()).toEqual({ width: 16, height: 16, color: "#123456" });
  });

  it("takes a tone's ink over the text colour", () => {
    render(
      <ToneContext.Provider value="#ff0000">
        <TextStyleProvider style={{ color: "#123456" }}>
          <Icon>
            <Glyph />
          </Icon>
        </TextStyleProvider>
      </ToneContext.Provider>,
    );
    expect(propsOf()).toEqual({ width: 20, height: 20, color: "#ff0000" });
  });
});

describe("F7 accessibility", () => {
  it("maps ARIA to React Native's accessibility props, leaving out what is unset", () => {
    expect(
      a11y({
        role: "button",
        "aria-label": "Save",
        "aria-disabled": true,
        "aria-pressed": false,
        "data-testid": "s",
      }),
    ).toEqual({
      accessibilityRole: "button",
      accessibilityLabel: "Save",
      accessibilityState: { disabled: true, checked: false },
      testID: "s",
    });
    expect(a11y({})).toEqual({});
    expect(a11y({ "aria-hidden": true })).toEqual({
      accessibilityElementsHidden: true,
      importantForAccessibility: "no-hide-descendants",
    });
  });
});

describe("F8 events", () => {
  it("takes onClick as the press and hands a field its value", () => {
    const onClick = vi.fn();
    const onChange = vi.fn();
    expect(pressProps({ onClick })).toEqual({ onPress: onClick });
    expect(pressProps({})).toEqual({});
    const field = valueProps({ value: "a", onChange });
    field.onChangeText?.("ab");
    expect(onChange).toHaveBeenCalledWith("ab");
    expect(field.value).toBe("a");
  });
});

describe("F9 metrics", () => {
  it("allows one physical pixel either way", () => {
    expect(withinPixel(38.33, 38, 3)).toBe(true);
    expect(withinPixel(38.4, 38, 3)).toBe(false);
  });

  it("grows a small control's touch target to 44pt without growing the box", () => {
    expect(hitSlopFor(26, 26)).toEqual({ top: 9, bottom: 9, left: 9, right: 9 });
    expect(hitSlopFor(120, 38)).toEqual({ top: 3, bottom: 3, left: 0, right: 0 });
    expect(hitSlopFor(120, 46)).toBeUndefined();
  });
});
