# AGENTS.md: OperationChimera Wiki Protocol

This document defines the operational protocols for the LLM as the curator of the OperationChimera Wiki. The goal is to build a persistent, compounding knowledge base that synthesizes information from raw sources.

## 1. Directory Structure
- `/raw`: Immutable source documents. Never modify these.
- `/wiki`: The synthesized knowledge base.
    - `index.md`: The central map of all wiki pages.
    - `log.md`: Append-only chronological history of all wiki operations.
    - `/sources`: One page per raw source summarizing its key contributions.
    - `/entities`: Pages for specific actors, organizations, tools, or locations.
    - `/concepts`: Pages for themes, theories, patterns, and overall synthesis.

## 2. Operational Workflows

### Ingest Workflow
When a new source is added to `/raw`:
1. **Read & Analyze**: Read the raw source fully.
2. **Draft Summary**: Create a summary page in `/wiki/sources/[source_name].md`.
    - Include a brief overview.
    - List key claims, facts, and dates.
    - Link to existing or new entity/concept pages.
3. **Update Entities & Concepts**: 
    - For every significant entity or concept mentioned, update its respective page in `/wiki/entities/` or `/wiki/concepts/`.
    - If the information is new, add it.
    - If it contradicts previous knowledge, explicitly flag the contradiction (e.g., "CONFLICT: Source X claims A, while Source Y claims B").
4. **Update Index**: Add/update the entry for the new source and any new entities/concepts in `wiki/index.md`.
5. **Log the Event**: Append a line to `wiki/log.md` following the format: `## [YYYY-MM-DD] ingest | [Source Name]`.

### Query Workflow
When asked a question:
1. **Consult Index**: Read `wiki/index.md` to identify relevant pages.
2. **Synthesize**: Read the relevant pages and synthesize a response.
3. **Cite**: Use internal wiki links (e.g., `[[EntityName]]`) to reference the knowledge.
4. **Compound**: If the answer reveals a new connection or synthesis, propose creating a new page in `/wiki/concepts/` to capture this insight.

### Lint Workflow
Periodically (or upon request):
1. **Audit Links**: Check for broken links or "orphan" pages.
2. **Identify Gaps**: Look for concepts mentioned frequently but lacking a dedicated page.
3. **Resolve Conflicts**: Review flagged contradictions and attempt to resolve them via further analysis or by requesting more sources.

## 3. Formatting Conventions
- **Page Links**: Use `[[Page Name]]` for internal wiki linking (Obsidian style).
- **Frontmatter**: Use YAML frontmatter for metadata:
  ```yaml
  ---
  type: entity | concept | source
  created: YYYY-MM-DD
  sources: [Source A, Source B]
  tags: [tag1, tag2]
  ---
  ```
- **Log Format**: `## [YYYY-MM-DD] [operation] | [description]`

## 4. Guiding Principles
- **Compounding Value**: Every interaction should ideally leave the wiki richer than it was before.
- **Transparency**: Always distinguish between a raw fact from a source and an LLM-generated synthesis.
- **Persistence**: The wiki is the primary memory. Do not rely on chat history for long-term knowledge.
