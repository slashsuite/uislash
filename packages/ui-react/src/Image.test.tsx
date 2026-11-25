// @vitest-environment jsdom
import { type ReactElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { hydrateWith } from "./dom.harness.js";
import { Image } from "./Image.js";
import { fireEvent, render, screen, user, within } from "./render.harness.js";

function Swap(): ReactElement {
  const [src, setSrc] = useState("/missing.png");
  return (
    <>
      <Image src={src} alt="Pairing code" />
      <button type="button" onClick={() => setSrc("/code.png")}>
        swap
      </button>
    </>
  );
}

describe("Image", () => {
  it("is an img named by alt, showing its src", () => {
    render(<Image src="/a.jpg" alt="A harbour" />);
    const img = screen.getByRole("img", { name: "A harbour" });
    expect(img.tagName).toBe("IMG");
    expect(img.getAttribute("src")).toBe("/a.jpg");
  });

  it("shows a placeholder image named by alt, and no img, when no src is given", () => {
    render(<Image alt="No preview" aspect="16:9" />);
    expect(screen.getByRole("img", { name: "No preview" }).tagName).not.toBe("IMG");
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("hides the placeholder from a screen reader when alt is empty", () => {
    // An empty alt leaves the placeholder no accessible name to find it by, which is the point.
    render(<Image alt="" data-testid="placeholder" />);
    expect(screen.getByTestId("placeholder").getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("img", { hidden: true })).toBeNull();
  });

  it("swaps a picture that fails to load for the placeholder, named by alt", () => {
    render(<Image src="/missing.png" alt="Pairing code" aspect="square" />);
    // A failed load is the browser's event; no person makes it.
    fireEvent.error(screen.getByRole("img", { name: "Pairing code" }));
    const placeholder = screen.getByRole("img", { name: "Pairing code" });
    expect(placeholder.tagName).not.toBe("IMG");
    expect(placeholder.hasAttribute("src")).toBe(false);
  });

  it("gives a new src its own try after one failed", async () => {
    render(<Swap />);
    // A failed load is the browser's event; no person makes it.
    fireEvent.error(screen.getByRole("img", { name: "Pairing code" }));
    expect(screen.getByRole("img", { name: "Pairing code" }).tagName).not.toBe("IMG");
    await user().click(screen.getByRole("button", { name: "swap" }));
    expect(screen.getByRole("img", { name: "Pairing code" }).getAttribute("src")).toBe("/code.png");
  });
});

/** A picture's markup, read as data: two looks are compared, never a class looked for. */
const markup = (image: ReactElement) => renderToStaticMarkup(image);

describe("Image loading and links", () => {
  it("loads lazily and decodes off the main thread by default", () => {
    render(<Image src="/a.jpg" alt="A harbour" />);
    const img = screen.getByRole("img", { name: "A harbour" });
    expect(img.getAttribute("loading")).toBe("lazy");
    expect(img.getAttribute("decoding")).toBe("async");
    expect(img.hasAttribute("fetchpriority")).toBe(false);
  });

  it("loads the priority picture at once, at a high fetch priority", () => {
    render(<Image src="/a.jpg" alt="A harbour" priority />);
    const img = screen.getByRole("img", { name: "A harbour" });
    expect(img.getAttribute("loading")).toBe("eager");
    expect(img.getAttribute("fetchpriority")).toBe("high");
  });

  it("with href is a link named by alt to the full picture, in a new tab", () => {
    render(<Image src="/a-small.jpg" alt="A harbour" href="/a.jpg" />);
    const link = screen.getByRole("link", { name: "A harbour" });
    expect(link.getAttribute("href")).toBe("/a.jpg");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noreferrer");
    expect(within(link).getByRole("img", { name: "A harbour" })).toBeInstanceOf(HTMLImageElement);
  });

  it("with href puts its id and aria-* on the link", () => {
    render(
      <Image src="/a-small.jpg" alt="" href="/a.jpg" id="shot" aria-label="Open the full shot" />,
    );
    expect(screen.getByRole("link", { name: "Open the full shot" }).id).toBe("shot");
  });

  it("is no link without href", () => {
    render(<Image src="/a.jpg" alt="A harbour" />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});

/** A covered 16:10 shot's markup, cropped from `crop`. */
const coverCropped = (crop: "center" | "top") =>
  markup(<Image src="/shot.png" alt="Shot" aspect="16:10" crop={crop} />);

/** A contained shot's markup, given `crop`, which it ignores. */
const containCropped = (crop: "center" | "top") =>
  markup(<Image src="/shot.png" alt="Shot" fit="contain" crop={crop} />);

describe("Image mat and crop", () => {
  it.each(["white", "page"] as const)("mat=%s shows the picture, named by alt", (mat) => {
    render(<Image src="/code.png" alt="Pairing code" mat={mat} />);
    expect(screen.getByRole("img", { name: "Pairing code" }).getAttribute("src")).toBe("/code.png");
  });

  it("draws each mat its own way, and no mat when it is left out", () => {
    const none = markup(<Image src="/code.png" alt="Code" fit="contain" />);
    const white = markup(<Image src="/code.png" alt="Code" mat="white" />);
    const page = markup(<Image src="/code.png" alt="Code" mat="page" />);
    expect(new Set([none, white, page]).size).toBe(3);
  });

  it("shows the whole picture on a mat, whatever fit says", () => {
    expect(markup(<Image src="/code.png" alt="Code" mat="page" fit="cover" />)).toBe(
      markup(<Image src="/code.png" alt="Code" mat="page" fit="contain" />),
    );
  });

  it("crops a cover picture from the top with crop=top, and leaves a contained one whole", () => {
    expect(coverCropped("top")).not.toBe(coverCropped("center"));
    expect(containCropped("top")).toBe(containCropped("center"));
  });

  it("draws xl wider than lg, and 16:10 as its own shape", () => {
    expect(markup(<Image src="/a.jpg" alt="A" width="xl" />)).not.toBe(
      markup(<Image src="/a.jpg" alt="A" width="lg" />),
    );
    expect(markup(<Image src="/a.jpg" alt="A" aspect="16:10" />)).not.toBe(
      markup(<Image src="/a.jpg" alt="A" aspect="16:9" />),
    );
  });
});

describe("Image whose picture failed before it hydrated", () => {
  const image = <Image src="/missing.png" alt="Pairing code" aspect="square" />;
  const hydrated: HTMLElement[] = [];
  // hydrateWith server-renders this to feed a hydration
  const hydrate = async (...args: Parameters<typeof hydrateWith>) => {
    hydrated.push(await hydrateWith(...args));
  };

  afterEach(() => {
    for (const container of hydrated.splice(0)) container.remove();
  });

  it("shows the placeholder named by alt, and no img", async () => {
    await hydrate(image, { complete: true, naturalWidth: 0 });
    const placeholder = screen.getByRole("img", { name: "Pairing code" });
    expect(placeholder.tagName).not.toBe("IMG");
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("keeps the picture when it loaded", async () => {
    await hydrate(image, { complete: true, naturalWidth: 120 });
    expect(screen.getByRole("img", { name: "Pairing code" }).getAttribute("src")).toBe(
      "/missing.png",
    );
  });

  it("keeps the picture while it is still loading", async () => {
    await hydrate(image, { complete: false, naturalWidth: 0 });
    expect(screen.getByRole("img", { name: "Pairing code" }).getAttribute("src")).toBe(
      "/missing.png",
    );
  });
});
