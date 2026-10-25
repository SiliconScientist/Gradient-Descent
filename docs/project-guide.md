# Gradient-Descent: technical guide

[Back to the website quickstart](../README.md)

This guide covers the campaign wiki's implementation, local development, and hosting. Reading the public website requires no installation.

## Technology stack

- **Quartz 4** is the underlying static-site generator; this checkout uses version 4.5.2.
- **TypeScript and Preact** define the configuration, layouts, and publishing components, with **SCSS** for styling.
- **Markdown and YAML frontmatter** store campaign notes and metadata in Git.
- Quartz uses **FlexSearch** for search and **D3 with PixiJS** for graph simulation and rendering.
- **Node.js and npm** run the build, producing static HTML, CSS, JavaScript, and assets hosted on **Cloudflare Pages**.

The project configures and customizes Quartz rather than implementing its standard features from scratch.

## Architecture and content organization

| Path                                    | Purpose                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [content/](../content/)                 | Campaign notes, including characters, factions, locations, missions, incidents, and mysteries. |
| [quartz.config.ts](../quartz.config.ts) | Site metadata, theme, Markdown processing, and output plugins.                                 |
| [quartz.layout.ts](../quartz.layout.ts) | Page components, navigation placement, and graph settings.                                     |
| [quartz/](../quartz/)                   | Quartz's publishing framework, components, and styles.                                         |
| [docs/](../docs/)                       | Project technical guide and bundled Quartz documentation, separate from campaign content.      |
| [package.json](../package.json)         | Dependencies, runtime requirements, and development scripts.                                   |

During a build, Quartz reads `content/`, parses Markdown and frontmatter, resolves links, and generates pages with backlinks and a content index in `public/`. The browser uses that index for search and graphs; no application database is required.

Notes use metadata such as `type: character` or `type: project`, descriptive filenames such as `Mission — …`, and headings such as `Facts` and `Unverified`. These are editorial conventions, not an enforced schema or automatic fact-checking system.

Links such as `[[Monarch]]` connect documents. Graph nodes represent notes (and tags when present), while edges represent links between them. The prose explains the relationship and its certainty; an edge alone does not establish a fact.

## Local development

Install Git, **Node.js 22 or newer**, and **npm 10.9.2 or newer**, as required by `package.json`. The repository's `.node-version` specifies Node.js 22.16.0.

1. Clone the repository and enter it:

   ```sh
   git clone https://github.com/SiliconScientist/Gradient-Descent.git
   cd Gradient-Descent
   ```

2. Install the locked dependencies:

   ```sh
   npm ci
   ```

3. Start the local preview:

   ```sh
   npx quartz build --serve
   ```

   Open `http://localhost:8080`. The server rebuilds as content changes; stop it with Ctrl+C.

4. Build the production website:

   ```sh
   npx quartz build
   ```

   Generated files go to `public/`, which Git ignores. The configured font caching and social-preview image generation require network access to download fonts. The default input is `content/`; `npm run docs` instead previews Quartz's bundled documentation.

5. Edit an existing `.md` file in `content/`, or add a descriptively named note. Follow the existing `type` metadata and `Facts`/`Unverified` conventions, record sources, and connect relevant entries with `[[Note name]]` or `[[Note name|display text]]`. Check the result in the preview before sharing changes.

## Deployment

The public site is served at [gradient-descent.pages.dev](https://gradient-descent.pages.dev/) on Cloudflare Pages. A local production build generates the static site in `public/`.

The checked-in [GitHub Actions workflows](../.github/workflows/) are inherited from Quartz and restrict their jobs to `jackyzha0/quartz`. Their preview deployment targets the upstream `quartz` Cloudflare project; they do **not** deploy this campaign wiki.

The repository does not establish the campaign site's production branch, Cloudflare build settings, or whether publishing is automatic. Those settings must be checked in the existing Cloudflare project before changing deployment behavior. The bundled [hosting guide](hosting.md) describes Quartz's supported setup, not a verified record of this site's deployment configuration.

The current configuration also retains `pageTitle: "Quartz 4"` and `baseUrl: "quartz.jzhao.xyz"`, and the layout retains upstream footer links. The title, canonical domain used by generated metadata, and footer have not yet been tailored to the campaign. `content/index.md` is currently empty.

## Project customizations

- **Graph placement and readability:** `quartz.layout.ts` moves the built-in graph from the sidebar to the center column above each note on desktop. Local graphs extend two links from the current note; local and global settings increase spacing, label size, and label visibility relative to the component defaults.
- **Page organization:** the explorer, search, and reading controls stay on the left, with backlinks and the desktop table of contents on the right. The campaign's named entries and cross-links support browsing by subject rather than session date.
- **Campaign information structure:** note types, mission and incident prefixes, source annotations, and separate facts and reports provide a shared vocabulary for updating the dossier.
- **Styling limitation:** [custom.scss](../quartz/styles/custom.scss) contains graph-edge CSS selectors, but the current graph draws edges on a PixiJS canvas. Those rules do not change the rendered edges; they are not an active visual customization.

These changes reuse Quartz's existing components and graph implementation.
