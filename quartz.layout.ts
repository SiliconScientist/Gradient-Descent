import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// A "bigger, labeled" graph configuration for readability
const BIG_GRAPH = Component.Graph({
  // Local graph appears on individual notes (neighbors/backlinks feel)
  localGraph: {
    drag: true,
    zoom: true,
    depth: 2,
    scale: 1.15,        // bigger initial zoom
    repelForce: 9.87,    // spread nodes out more
    centerForce: 0.33,  // keep network centered
    linkDistance: 55,   // increase spacing to reduce label overlap
    fontSize: 1.05,     // show readable labels next to nodes
    opacityScale: 3.0, // keep labels visible at wider zooms
  },

  // Global graph shows the whole vault connections
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,          // global graph
    scale: 1.0,         // slightly zoomed in
    repelForce: 9.87,   // spread nodes out more (important for global)
    centerForce: 0.33,
    linkDistance: 75,   // more spacing for dense graphs
    fontSize: 1.0,      // readable labels
    opacityScale: 3.0,
  },
})

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),

    // Put the graph in the center column, above the content.
    // DesktopOnly keeps mobile from getting swamped.
    Component.DesktopOnly(BIG_GRAPH),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    // Graph removed from sidebar (now center)
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
