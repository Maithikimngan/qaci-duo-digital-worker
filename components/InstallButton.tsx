"use client";

import { useState } from "react";

import DuoAvatar from "@/components/DuoAvatar";

// Copies the generated package to the clipboard; QACI Duo has no public install deep link.
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
