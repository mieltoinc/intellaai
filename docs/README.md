# Intella documentation

Documentation for Intella — build and delegate tasks to durable AI agents in sandboxes. The site is built with [Mintlify](https://mintlify.com) and follows the technical writing and component guidelines in `.cursor/rules/mintlify.mdc`.

## Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint) to preview the docs locally:

```bash
npm i -g mint
```

From the root of this docs folder (where `docs.json` is located), run:

```bash
mint dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Publishing changes

Install the Mintlify GitHub app from the [dashboard](https://dashboard.mintlify.com/settings/organization/github-app). Pushing to the default branch deploys changes to the live docs.

## Writing guidelines

- Use the rules in **`.cursor/rules/mintlify.mdc`** for structure, tone, and Mintlify components (Steps, Tabs, CodeGroup, Callouts, Frame, etc.).
- Write in second person (“you”), active voice, and present tense.
- Add YAML frontmatter with `title` and `description` to every page.
- Use descriptive headings and alt text for images.

## Troubleshooting

- **Preview not running**: Run `mint update` to use the latest CLI.
- **404 on a page**: Ensure you’re in a directory that contains a valid `docs.json`.

## Resources

- [Mintlify documentation](https://mintlify.com/docs)
- [Intella API](https://app.intella.xyz)
