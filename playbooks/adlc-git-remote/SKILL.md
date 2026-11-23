---
name: adlc-git-remote
title: Work on an existing GitHub repository
description: "Clone an existing GitHub repository from a link, do the work on a dedicated branch, push that branch with the owner's approval and optionally open a pull request. Never touches the base branch."
triggers: "github link, existing repository, clone repo, push to branch, open a pull request, contribute to repo, làm trên repo github, push lên branch"
tags: adlc-craft, internal, github
license: Unspecified
author: QACI Duo
---

# Work on an existing GitHub repository

The owner gives a GitHub repository link (`https://github.com/<owner>/<repo>`, optionally `/tree/<branch>`) and asks for work on it. You clone it, run the normal ADLC process on a dedicated work branch, then push **that branch** to the same repository and, if the owner wants, open a pull request into the base branch. The repository's maintainers merge the pull request; you never merge on GitHub and never write to the base branch.

This skill replaces the local-only parts of `adlc-git-local` for this kind of work: branch naming, commits and review stay the same, but there is no local merge into the base branch — the pull request takes its place.

## When to use

- The owner's request contains a GitHub repository URL and asks to change code in it (feature, bugfix, chore, research spike).
- The owner names an existing remote branch to continue work on.

**Not for:** publishing a finished local project to a new or empty repository (`deploy-github`), Azure DevOps repositories (not supported yet — tell the owner), approval decisions (`adlc-approval`), local-only work (`adlc-git-local`).

## Inputs

| Input | Required | Default |
|---|---|---|
| Repository URL | Yes | — (from the owner's message) |
| Base branch | No | `/tree/<branch>` in the URL, else the repository's default branch |
| Target branch | No | New branch `adlc/<task>` cut from the base branch |
| Existing branch to continue | No | Only when the owner names it explicitly |
| Open a pull request? | No | Ask with a card after the push (each time) |
| Access | Yes | Public: anonymous clone. Private, or any push: GitHub PAT via `request_credential` |

## Access

- **Read**: a public repository is cloned anonymously. A private one needs the PAT before cloning.
- **Write** (push, pull request) always needs the PAT, requested **once** when first needed with exactly `label: "GitHub PAT"`, `delivery: "file"`, `reason`: "Fine-grained token for <owner>/<repo> only: Contents (Read & write), Metadata (Read), Pull requests (Read & write); expiry at most 90 days." The connected GitHub app cannot clone or push a local branch with its history, so it is not used for this skill except to look up repository info or open the pull request if the owner prefers the app.
- Token handling is the same as in `deploy-github` ("Fallback: the owner's PAT"): read it into a variable per command, pass it only through `http.extraheader`, always add `-c credential.helper=`, never print it or write it to chat, logs, files, `git config` or a remote URL. Delete the secret file when the task ends.
- **Never sign in to GitHub through the browser.**

```bash
PAT=$(cat "<secret file path>")
GIT_AUTH="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$PAT" | base64 | tr -d '\n')"
git -c credential.helper= -c http.extraheader="$GIT_AUTH" <clone|fetch|push> ...
```

## Procedure

1. **Parse the link.** Extract `<owner>`, `<repo>` and an optional branch from the URL. *Check:* the host is `github.com`; anything else (GitLab, Azure DevOps, a fork you were not given) → tell the owner it is not supported and stop.
2. **Clone or refresh** into `sharedBotFolder/repos/<owner>-<repo>` (persistent, outside the plan folder):
   - not present: `git clone https://github.com/<owner>/<repo>.git sharedBotFolder/repos/<owner>-<repo>` (with the auth header for a private repository);
   - present: `git fetch --prune origin` and confirm `git remote get-url origin` is the same repository.
   *Check:* clone failed with 404/401 on a public URL → the repository is private or does not exist: request the PAT once and retry; still failing → report the error verbatim and stop.
3. **Resolve the base branch**: the branch from the URL, else `git symbolic-ref --short refs/remotes/origin/HEAD` (strip `origin/`). Record repository, base branch and base commit hash in the progress log.
4. **Read the repository's own rules** before any change: `CONTRIBUTING.md`, `AGENTS.md`, PR templates (`.github/pull_request_template.md`), commit message conventions, branch naming rules, CI workflows. Follow them; they override the defaults here.
5. **Create the work branch** in a worktree from the fresh base: `git worktree add ../<repo>-<task> -b adlc/<task> origin/<base>` (or the prefix the repository requires). To continue an existing branch the owner named: `git worktree add ../<repo>-<task> <branch>` tracking `origin/<branch>`.
6. **Run the process skill** (`adlc-feature`, `adlc-bugfix`, …) as usual: Specify → Plan → Implement → Verify, committing on the work branch under your DW name (`adlc-git-local`, step 2) and reviewing with `adlc-code-review`. *Check:* tests and real-condition verification pass on the branch before going further.
7. **Sync before pushing**: `git fetch origin`; if `origin/<base>` moved, `git merge origin/<base>` into the work branch (never rebase a branch that has been pushed), re-run the tests. For an existing branch: if `origin/<branch>` has new commits, merge them in and re-test.
8. **Push approval — always a card**, whatever the `Approval points:` line says (it leaves the system). The card shows: repository, target branch (new or existing), base branch, number of commits (`git log --oneline origin/<base>..HEAD`), `git diff --stat origin/<base>...HEAD`, test results. Options: `Approve` / `Request changes`.
9. **Push** only the work branch, never force: `git -c credential.helper= -c http.extraheader="$GIT_AUTH" push origin adlc/<task>`. *Check:* a non-fast-forward rejection → fetch, merge, re-test, and send the card again; never `--force`. Verify with `git ls-remote origin adlc/<task>` that the remote hash equals your local `HEAD`.
10. **Pull request — card each time**: "Open a pull request from `adlc/<task>` into `<base>`?" with options `Open PR` / `Draft PR` / `No PR`. On approval, create it with the repository's PR template filled in (title, summary, linked issue if given, tests run, "Verified by me" evidence) — via the GitHub REST API with the PAT, or the connected app's pull request tool if available:
    ```bash
    printf 'header = "Authorization: Bearer %s"\n' "$PAT" | curl -sS -K - -X POST \
      -H "Accept: application/vnd.github+json" https://api.github.com/repos/<owner>/<repo>/pulls \
      -d @"<plan folder>/pr.json"
    ```
    `pr.json` holds `title`, `head` (`adlc/<task>`), `base`, `body`, `draft`.
11. **Report** with `adlc-report`. There is no local merge in this mode: the Merge phase is replaced by "pushed + PR opened (or not)". Clean up: `git worktree remove ../<repo>-<task>`, delete the secret file.

## Output

```
### Repository — GitHub
Repository: https://github.com/<owner>/<repo>  (base: <base> @ <base hash>)
Branch: adlc/<task>  → remote hash <hash> (matches local HEAD: yes)
Commits pushed: <n>  (git log --oneline origin/<base>..adlc/<task>)
Tests: <command> → <passed>/<total>
Push approval: owner approved at <time>
Pull request: <URL> (draft: yes/no) | not opened (owner chose No PR)
```

## Quality checklist

- [ ] Base branch and base commit recorded; repository rules (`CONTRIBUTING.md`, PR template) read and followed.
- [ ] Work done on `adlc/<task>` (or the owner-named branch) in a worktree; nothing committed on the base branch.
- [ ] Synced with `origin/<base>` and tests re-run right before pushing.
- [ ] Push approval card answered by the owner before the push; PR card answered before creating the PR.
- [ ] Remote hash verified equal to local `HEAD`.
- [ ] Token never printed or stored; secret file deleted at the end.

## Guardrails

**Never**
- Never push to the base branch, `main`, `master` or any protected branch; never merge a pull request on GitHub.
- Never force-push, rebase pushed commits, delete remote branches, or create tags/releases in this mode.
- Never change repository settings, branch protection, secrets, webhooks or collaborators.
- Never write the token into the remote URL, `git config`, a file in the repository, or any log.
- Never push to a repository other than the one the owner linked (no forks, no mirrors) without asking.

**Ask first**
- Every push (Push approval card) and every pull request (PR card).
- Continuing someone else's existing branch.
- Commits that touch CI workflows (`.github/workflows/`) — call this out on the Push approval card.

## Example

**Request:** "https://github.com/acme/shop — the export button downloads an empty CSV when a filter is active. Fix it and push a branch."

**Response outline:** Classified as bugfix (`adlc-triage`), repository mode GitHub. Public repo cloned to `sharedBotFolder/repos/acme-shop`; base `main` @ `3f2a1c9`. Read `CONTRIBUTING.md` (Conventional Commits). Branch `adlc/csv-export-filter`; failing test reproduces the bug, fix, 42/42 tests, real export verified with `curl`. PAT requested (Contents + Pull requests, acme/shop only). Push approval card → Approve; pushed, remote hash matches. PR card → Open PR; PR #128 created with the template filled. Completion report with the commit list, test output and PR link.
