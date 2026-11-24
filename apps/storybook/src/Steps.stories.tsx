import type { Meta, StoryObj } from "@storybook/react-vite";
import { Code, Step, Steps } from "@slashsuite/ui-react";
import * as examples from "../../../packages/ui-react/docs/examples/Steps.examples.js";

const meta: Meta = { title: "Content/Steps" };
export default meta;
type S = StoryObj;

export const WithDetails: S = {
  render: () => (
    <div className="max-w-md">
      <Steps aria-label="Get started">
        <Step title="Install the CLI">
          Run <Code>bun add -d pixelslash</Code> in your repo.
        </Step>
        <Step title="Add a token">Create one in Settings and export it in CI.</Step>
        <Step title="Upload a build">
          Run <Code>pixelslash upload</Code>.
        </Step>
      </Steps>
    </div>
  ),
};

export const TitlesOnly: S = {
  render: () => (
    <div className="max-w-md">
      <Steps>
        <Step title="Sign in" />
        <Step title="Pick a project" />
        <Step title="Upload" />
      </Steps>
    </div>
  ),
};

export const DoNumbers: S = {
  render: examples.DoNumbers,
};

export const DontNumbers: S = {
  render: examples.DontNumbers,
};

export const DoOrder: S = {
  render: examples.DoOrder,
};

export const DontOrder: S = {
  render: examples.DontOrder,
};

/** `size="lg"`: the steps across a landing page from `md`, each number at feature size; stacked on a phone. Two to four steps. */
export const Large: S = {
  parameters: { layout: "padded" },
  render: () => (
    <Steps size="lg" aria-label="How it works">
      <Step title="Install">Add the package and a config file.</Step>
      <Step title="Capture">Shoot every story in every theme.</Step>
      <Step title="Review">Accept what changed, on the pull request.</Step>
    </Steps>
  ),
};
