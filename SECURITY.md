# Security

- Playbooks and workers never contain tokens, passwords, keys, personal data or links with credentials. CI scans for
  common secret patterns and refuses frontmatter fields such as `token`, `password` or `api_key`.
- CI refuses common ways to hide instructions in a SKILL.md: long base64-like strings, `curl … | sh`, and invisible
  Unicode characters.
- The repository accepts only Markdown files in the known layout; no scripts, binaries or extra files next to a
  SKILL.md.
- QACI Duo treats imported files as untrusted: it takes the description and the procedure only, grants no permissions
  and connects no apps. A skill imported through the Skills library stays off until a person switches it on.
- If you find a secret in this repository, **do not** open a public issue. Contact a code owner listed in
  `.github/CODEOWNERS` privately, revoke the secret immediately, then remove it from the Git history.
