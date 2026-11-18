import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ConnectorIcon from "@/components/ConnectorIcon";
import CopyMarkdown from "@/components/CopyMarkdown";
import DuoAvatar from "@/components/DuoAvatar";
import InstallButton from "@/components/InstallButton";
import { getWorker, getWorkerMarkdown, getWorkers, workerRawUrl } from "@/lib/repository";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWorkers().map((entry) => ({ slug: entry.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWorker(slug);
  if (!entry) return {};
  return {
    title: entry.name,
    description: entry.tagline,
    openGraph: { title: entry.name, description: entry.tagline },
    twitter: { card: "summary", title: entry.name, description: entry.tagline },
  };
}

export default async function WorkerPage({ params }: Props) {
  const { slug } = await params;
  const entry = getWorker(slug);
  const markdown = getWorkerMarkdown(slug);
  if (!entry || !markdown) notFound();

  const related = getWorkers()
    .filter((candidate) => candidate.id !== entry.id)
    .sort((a, b) => Number(b.category === entry.category) - Number(a.category === entry.category))
    .slice(0, 3);

  return (
    <main className="detail-page">
      <article className="detail-wrap">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">All workers</Link><span>/</span><span>{entry.category}</span>
        </nav>

        <section className="detail-hero">
          <div className="detail-heading-row">
            <div>
              <div className="detail-title">
                <DuoAvatar
                  color={entry.agents[0]?.appearance.color ?? "green"}
                  expression="happy"
                  size={64}
                  animated
                />
                <h1>{entry.name}</h1>
              </div>
              <p className="detail-author">Contributed by <strong>{entry.author.name}</strong></p>
            </div>
            <div className="detail-install">
              <InstallButton markdown={markdown} />
              <span>{entry.agents.length} agent{entry.agents.length === 1 ? "" : "s"} · about {entry.setupMinutes} min setup</span>
            </div>
          </div>

          <div className="detail-summary">
            <p>{entry.summary || entry.tagline}</p>
          </div>

          <p className="detail-universal">
            Don&apos;t use QACI Duo? <CopyMarkdown markdown={markdown} label="Copy for another Chief of Staff" />
          </p>

          <section className="detail-section" aria-labelledby="works-with-heading">
            <h2 id="works-with-heading">Works with</h2>
            <div className="detail-connectors">
              {entry.requirements.apps.map((app) => (
                <span className="connector-chip" key={app.slug}>
                  <ConnectorIcon slug={app.slug} label={app.label} size="small" />
                  <span>{app.label}</span>
                  {app.optional && <small>optional</small>}
                </span>
              ))}
              {(entry.connections ?? []).map((connection) => (
                <span className="connector-chip" key={connection.key} title={connection.reason}>
                  <span aria-hidden="true">🔌</span>
                  <span>{connection.label} (MCP)</span>
                </span>
              ))}
              {entry.requirements.apps.length === 0 && (entry.connections ?? []).length === 0 && (
                <span className="connector-none">No connector required</span>
              )}
            </div>
          </section>

          <section className="detail-section" aria-labelledby="team-heading">
            <h2 id="team-heading">Meet the team</h2>
            <div className="member-grid">
              {entry.agents.map((agent) => {
                const skillEntries = (agent.skills ?? [])
                  .map((name) => entry.skills?.entries.find((skill) => skill.name === name))
                  .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill));
                const playbookEntries = (agent.playbooks ?? [])
                  .map((key) => entry.playbooks?.find((playbook) => playbook.key === key))
                  .filter((playbook): playbook is NonNullable<typeof playbook> => Boolean(playbook));
                const connectionEntries = (agent.connections ?? [])
                  .map((key) => entry.connections?.find((connection) => connection.key === key))
                  .filter((connection): connection is NonNullable<typeof connection> => Boolean(connection));
                const isLeader = entry.team?.leader === agent.key;
                return (
                  <details className="member-card" key={agent.key} open={entry.agents.length <= 1}>
                    <summary>
                      <DuoAvatar color={agent.appearance.color} expression="happy" size={42} />
                      <div>
                        <strong>{agent.name}{isLeader && <span className="member-lead-badge"> · Chief of Staff</span>}</strong>
                        <span>{agent.title}</span>
                      </div>
                    </summary>
                    <div className="member-card-body">
                      {agent.description && <p>{agent.description}</p>}
                      {playbookEntries.length > 0 && (
                        <div className="member-capabilities">
                          <span className="member-capabilities-label">Playbooks</span>
                          {playbookEntries.map((playbook) => (
                            <span className="tag-chip" key={playbook.key} title={playbook.summary}>{playbook.name}</span>
                          ))}
                        </div>
                      )}
                      {skillEntries.length > 0 && (
                        <div className="member-capabilities">
                          <span className="member-capabilities-label">Skills</span>
                          {skillEntries.map((skill) => (
                            <span className="tag-chip" key={skill.name} title={skill.description}>{skill.name}</span>
                          ))}
                        </div>
                      )}
                      {connectionEntries.length > 0 && (
                        <div className="member-capabilities">
                          <span className="member-capabilities-label">Connections</span>
                          {connectionEntries.map((connection) => (
                            <span className="tag-chip" key={connection.key} title={connection.reason}>{connection.label}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </section>

          <section className="detail-facts" aria-label="Package contents">
            <div><strong>{entry.agents.length}</strong><span>agent{entry.agents.length === 1 ? "" : "s"}</span></div>
            <div><strong>{entry.rooms?.length ?? 0}</strong><span>shared rooms</span></div>
            <div><strong>{entry.playbooks?.length ?? 0}</strong><span>playbooks</span></div>
            <div><strong>{entry.skills?.entries.length ?? 0}</strong><span>skills</span></div>
            <div><strong>{entry.connections?.length ?? 0}</strong><span>connections</span></div>
            <div><strong>{entry.routines?.length ?? 0}</strong><span>paused routines</span></div>
          </section>

          {entry.proof && (
            <aside className="detail-proof">
              <span>Public outcome claim</span>
              <strong>{entry.proof.amount}</strong>
              <p>
                Reported by {entry.proof.source.author}. This is source context, not independently verified revenue.
                {" "}<a href={entry.proof.source.url} target="_blank" rel="noreferrer">View source ↗</a>
              </p>
            </aside>
          )}

          <details className="template-source">
            <summary>View the complete Markdown playbook</summary>
            <div className="template-source-head">
              <span>{entry.id}.md</span>
              <div><CopyMarkdown markdown={markdown} label="Copy" /><a href={workerRawUrl(entry.id)} target="_blank" rel="noreferrer">Raw file (library branch) ↗</a></div>
            </div>
            <pre>{markdown}</pre>
          </details>
        </section>
      </article>

      <section className="related-section" aria-labelledby="related-heading">
        <h2 id="related-heading">Related workers</h2>
        <div className="related-grid">
          {related.map((candidate) => (
            <article className="related-card" key={candidate.id}>
              <Link href={`/workers/${candidate.id}`}>
                <div>
                  <h3>{candidate.name}</h3>
                  <DuoAvatar
                    color={candidate.agents[0]?.appearance.color ?? "green"}
                    expression="happy"
                    size={42}
                  />
                </div>
                <p>{candidate.tagline}</p>
                <span>{candidate.agents.length} agent{candidate.agents.length === 1 ? "" : "s"}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
