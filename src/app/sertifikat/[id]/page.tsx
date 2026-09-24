import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { GhostButton, SignalButton } from "@/components/ui/Buttons";
import { getCertificateById, getPublicContent } from "@/lib/content";

export const revalidate = 300;

export async function generateStaticParams() {
  const { certificates } = await getPublicContent();
  return certificates.map((certificate) => ({ id: certificate.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const certificate = await getCertificateById(id);
  if (!certificate) return { title: "Certificate not found — Ekabekti / Systems" };
  return {
    title: `${certificate.title} — Ekabekti / Systems`,
    description: `${certificate.title} oleh ${certificate.issuer}.`,
  };
}

function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function CertificateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const certificate = await getCertificateById(id);
  if (!certificate) notFound();

  return (
    <main className="cert-detail">
      <div className="container">
        <Link className="project-detail__back" href="/#sertifikat">← Back to credentials</Link>

        <div className="cert-detail__card">
          <Reveal className="cert-detail__badge" y={24}>
            {certificate.badge_image_url ? (
              <Image
                src={certificate.badge_image_url}
                alt={`Badge ${certificate.title}`}
                fill
                sizes="320px"
                className="cert-detail__badge-image"
                priority
              />
            ) : (
              <div className="cert-detail__monogram" aria-hidden="true">EB</div>
            )}
            <div className="cert-detail__scan" aria-hidden="true" />
          </Reveal>

          <Reveal delay={0.1} className="cert-detail__body" y={24}>
            <span className="mono-label">Professional credential</span>
            <h1>{certificate.title}</h1>
            <p className="cert-detail__issuer">{certificate.issuer}</p>

            <dl className="cert-detail__facts">
              <div>
                <dt>Issued</dt>
                <dd><time dateTime={certificate.issue_date}>{formatDate(certificate.issue_date)}</time></dd>
              </div>
              {certificate.expiry_date && (
                <div>
                  <dt>Expires</dt>
                  <dd><time dateTime={certificate.expiry_date}>{formatDate(certificate.expiry_date)}</time></dd>
                </div>
              )}
              {certificate.credential_id && (
                <div>
                  <dt>Credential ID</dt>
                  <dd>{certificate.credential_id}</dd>
                </div>
              )}
            </dl>

            <div className="cert-detail__actions">
              {certificate.credential_url ? (
                <SignalButton href={certificate.credential_url}>Verifikasi kredensial</SignalButton>
              ) : (
                <GhostButton href="/#kontak">Minta bukti pendukung</GhostButton>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
