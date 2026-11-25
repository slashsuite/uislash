import type { Preview } from "@storybook/react-vite";
import { type LinkAdapter, LinkProvider } from "@slashsuite/ui-react";
import { declaresDark } from "@slashsuite/themes-shared";
import { ThemeDocument, THEMES, themeNames } from "./themes";
import "./tailwind.css";

// Storybook opens in the dark theme, as it always has. The first theme by id is now a light one.
const initialTheme = themeNames.find((name) => declaresDark(THEMES[name] ?? "")) ?? themeNames[0];

/**
 * Under automation (the visual capture, the e2e) every lazy image loads at once. A full-page shot
 * holds every image, and the capture the Visual workflow pins waits for each to load, which a lazy
 * one below the fold never does; newer captures make them eager themselves. A person browsing
 * Storybook still gets lazy loading.
 */
function loadLazyImagesAtOnce() {
  for (const img of document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')) {
    img.loading = "eager";
  }
}
if (navigator.webdriver) {
  new MutationObserver(loadLazyImagesAtOnce).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributeFilter: ["loading"],
  });
}

/** Stands in for an app's router Link: an in-app href stays on the story instead of leaving Storybook. */
const StoryLink: LinkAdapter = ({ href, ...rest }) => <a {...rest} href={`#${href}`} />;

const preview: Preview = {
  parameters: {
    // A story is cropped to its component by default; a page or layout opts in to "fullscreen".
    layout: "centered",
    // The three widths the Layout stories are viewed at.
    viewport: {
      options: {
        phone: { name: "Phone (375)", styles: { width: "375px", height: "812px" }, type: "mobile" },
        tablet: {
          name: "Tablet (768)",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        desktop: {
          name: "Desktop (1280)",
          styles: { width: "1280px", height: "800px" },
          type: "desktop",
        },
      },
    },
  },
  initialGlobals: { theme: initialTheme },
  globalTypes: {
    theme: {
      description: "Theme (one per CSS file in themes/)",
      toolbar: {
        icon: "paintbrush",
        dynamicTitle: true,
        items: themeNames.map((name) => ({ value: name, title: name })),
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeDocument
        // A story that lays out every theme itself must not sit inside the toolbar's theme scope.
        theme={
          context.parameters["allThemes"] === true
            ? undefined
            : String(context.globals["theme"] ?? themeNames[0])
        }
        padded={
          context.parameters["layout"] === "fullscreen" && context.parameters["bare"] !== true
        }
      >
        <LinkProvider link={StoryLink}>
          <Story />
        </LinkProvider>
      </ThemeDocument>
    ),
  ],
};
export default preview;
