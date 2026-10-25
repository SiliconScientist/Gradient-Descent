import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { resolveRelative } from "../util/path"

const groups = [
  { title: "Places", types: ["location", "structure"] },
  { title: "Factions and groups", types: ["faction", "unit", "polity"] },
  { title: "Characters and entities", types: ["character", "person", "entity"] },
  { title: "Missions, projects, and operations", types: ["mission", "project", "operation"] },
  { title: "Incidents and mysteries", types: ["event", "mystery", "assertion", "evidence"] },
  { title: "Items, vehicles, and phenomena", types: ["item", "vehicle", "phenomena"] },
  { title: "Other notes", types: [] },
]

export default (() => {
  const CampaignDirectory: QuartzComponent = ({ fileData, allFiles }) => {
    if (fileData.slug !== "index") return null

    const notes = allFiles
      .filter((file) => file.slug && file.slug !== "index")
      .sort((a, b) => (a.frontmatter?.title ?? "").localeCompare(b.frontmatter?.title ?? ""))
    const grouped = groups.map((group) => ({ ...group, notes: [] as typeof notes }))
    for (const note of notes) {
      const group = grouped.find((group) => group.types.includes(String(note.frontmatter?.type)))
      ;(group ?? grouped[grouped.length - 1]).notes.push(note)
    }

    // Render navigation outside the Markdown link index, keeping directory links
    // from connecting every campaign note through the homepage in local graphs.
    return (
      <section class="campaign-directory" aria-labelledby="browse-notes">
        <h2 id="browse-notes">Browse all notes</h2>
        <p>Choose a subject to open its notes.</p>
        <ul>
          {grouped
            .filter((group) => group.notes.length > 0)
            .map((group, index) => (
              <li>
                <a href={`#note-group-${index}`}>{group.title}</a>
              </li>
            ))}
        </ul>
        {grouped
          .filter((group) => group.notes.length > 0)
          .map((group, index) => (
            <section aria-labelledby={`note-group-${index}`}>
              <h3 id={`note-group-${index}`}>{group.title}</h3>
              <ul>
                {group.notes.map((note) => (
                  <li>
                    <a class="internal" href={resolveRelative(fileData.slug!, note.slug!)}>
                      {note.frontmatter?.title ?? note.slug}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </section>
    )
  }
  return CampaignDirectory
}) satisfies QuartzComponentConstructor
