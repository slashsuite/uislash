import {
  AppShell,
  ArticleLayout,
  Caption,
  Card,
  Image,
  ProseLayout,
  SectionHeading,
  Tabs,
  Text,
} from "@slashsuite/ui-react";
import { sampleScenes } from "./sampleScene.js";

/** A whole blog post: the shell with its brand and nav, then the article and its related posts. */
export const FullPage = () => (
  <AppShell
    brand={<a href="#">Hack Cove</a>}
    nav={
      <Tabs
        label="Main"
        items={[
          { label: "Shop", href: "#shop" },
          { label: "Blog", href: "#blog", selected: true },
        ]}
      />
    }
  >
    <ArticleLayout
      title="Brewing a pale ale at home"
      description="Everything you need for a first brew, and what to do on the day."
      author="Sam Mokoena"
      date="12 November 2026"
      dateTime="2026-11-12"
      readingTime="6 min read"
      image={
        <Image
          src={sampleScenes[0]?.src}
          alt="A brew kettle on the stove"
          aspect="16:9"
          width="full"
        />
      }
      related={["Stout in a weekend", "Dry hopping, step by step", "Your first lager"].map(
        (title) => (
          <Card key={title} title={title}>
            <Text>A recipe and the kit that brews it.</Text>
          </Card>
        ),
      )}
    >
      <SectionHeading>What you need</SectionHeading>
      <Text>A 20 litre kettle, a fermenter with an airlock, and the pale ale kit.</Text>
      <SectionHeading>On the day</SectionHeading>
      <Text>Heat the water to 67°C, stir in the grain and hold it there for an hour.</Text>
    </ArticleLayout>
  </AppShell>
);

/** A blog post is an `ArticleLayout`: the byline, the picture and the related posts each have their place. */
export const DoPost = () => (
  <ArticleLayout
    title="Brewing a pale ale at home"
    description="Everything you need for a first brew, and what to do on the day."
    author="Sam Mokoena"
    date="12 November 2026"
    dateTime="2026-11-12"
    readingTime="6 min read"
    image={
      <Image
        src={sampleScenes[0]?.src}
        alt="A brew kettle on the stove"
        aspect="16:9"
        width="full"
      />
    }
    related={["Stout in a weekend", "Dry hopping, step by step", "Your first lager"].map(
      (title) => (
        <Card key={title} title={title}>
          <Text>A recipe and the kit that brews it.</Text>
        </Card>
      ),
    )}
  >
    <SectionHeading>What you need</SectionHeading>
    <Text>A 20 litre kettle, a fermenter with an airlock, and the pale ale kit.</Text>
    <SectionHeading>On the day</SectionHeading>
    <Text>Heat the water to 67°C, stir in the grain and hold it there for an hour.</Text>
  </ArticleLayout>
);

/** A `ProseLayout` with a hand-made byline and no related posts: the date is a loose caption, nobody wrote it, and the reader is left at a dead end. */
export const DontPost = () => (
  <ProseLayout title="Brewing a pale ale at home">
    <Caption>12 November 2026</Caption>
    <SectionHeading>What you need</SectionHeading>
    <Text>A 20 litre kettle, a fermenter with an airlock, and the pale ale kit.</Text>
  </ProseLayout>
);
