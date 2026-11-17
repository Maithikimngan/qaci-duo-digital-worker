"use client";

import { useState } from "react";

import DuoAvatar from "@/components/DuoAvatar";

// Ported from openmausbot-teams' components/InstallButton.tsx, adapted: that component linked to a custom
// `openmausbot://install?url=...` URI scheme OpenMausBot registers. QACI Duo has no such public deep link, so
// rather than invent one this copies the generated package to the clipboard — the real install path documented
// in this repository's README.md ("+ -> Templates -> Community templates -> Load -> Add team"). See
// PORTING_NOTES.md.
export default function InstallButton({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="button button-primary install-button"
      onClick={() => {
        void navigator.clipboard.writeText(markdown).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      <DuoAvatar color="green" expression="excited" size={22} />
      {copied ? "Copied — paste it into + → Templates → Import" : "Copy this Digital Worker"}
    </button>
  );
}
