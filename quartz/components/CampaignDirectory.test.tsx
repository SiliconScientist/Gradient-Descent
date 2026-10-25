import test from "node:test"
import assert from "node:assert/strict"
import { render } from "preact-render-to-string"
import CampaignDirectory from "./CampaignDirectory"
import { QuartzComponentProps } from "./types"

const Directory = CampaignDirectory()
const props = {
  fileData: { slug: "index" },
  allFiles: [
    { slug: "index", frontmatter: { title: "Campaign archive" } },
    { slug: "Monarch", frontmatter: { title: "Monarch", type: "character" } },
    { slug: "Deep", frontmatter: { title: "Deep", type: "location" } },
    { slug: "Bell", frontmatter: { title: "Bell", type: "location" } },
    { slug: "Unknown", frontmatter: { title: "Unknown", type: "new-type" } },
  ],
} as QuartzComponentProps

test("homepage directory groups and alphabetizes notes, including unknown types", () => {
  const html = render(<Directory {...props} />)
  assert.match(html, /Places/)
  assert.match(html, /Characters and entities/)
  assert.match(html, /Other notes/)
  assert.match(html, /href="\.\/Bell"/)
  assert.ok(html.indexOf(">Bell</a>") < html.indexOf(">Deep</a>"))
  assert.equal((html.match(/class="internal"/g) ?? []).length, 4)
  assert.doesNotMatch(html, /Campaign archive/)
})

test("directory is absent from individual notes and leaves graph links untouched", () => {
  const before = JSON.stringify(props.allFiles)
  render(<Directory {...props} />)
  assert.equal(JSON.stringify(props.allFiles), before)
  assert.equal(
    render(
      <Directory {...props} fileData={{ slug: "Bell" } as QuartzComponentProps["fileData"]} />,
    ),
    "",
  )
})
