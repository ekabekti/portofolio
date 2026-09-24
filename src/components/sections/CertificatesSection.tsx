import SectionWrapper, { SectionTitle } from "@/components/ui/SectionWrapper";
import Reveal from "@/components/ui/Reveal";
import type { Certificate } from "@/lib/data";

interface CertificatesSectionProps {
  certificates: Certificate[];
}

function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("id-ID", {
    month: "short",
    year: "numeric",
  });
}

export default function CertificatesSection({ certificates }: CertificatesSectionProps) {
  return (
    <SectionWrapper id="sertifikat">
      <SectionTitle
        index="03"
        eyebrow="Receipts / credentials"
        subtitle="Sertifikasi bukan ujung proses. Ia adalah cara menjaga standar tetap relevan ketika teknologi dan kebutuhan terus bergerak."
      >
        Proof, not <em>decoration.</em>
      </SectionTitle>

      <div className="certificates-layout">
        <Reveal className="certificate-aside">
          <div className="certificate-aside__stamp" aria-hidden="true">Verified<br />signal<br />2025</div>
          <h3 className="certificate-aside__title">A practice that keeps learning.</h3>
          <p className="certificate-aside__copy">
            Setiap credential adalah checkpoint—bukan wallpaper. Yang saya ukur bukan sertifikatnya, tetapi perubahan yang bisa saya kirim setelah membacanya.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="certificate-list">
          {certificates.length === 0 && (
            <div className="empty-state">
              <span className="mono-label">Credentials / empty</span>
              <p>Belum ada kredensial yang ditampilkan.</p>
            </div>
          )}
          {certificates.map((certificate, index) => {
            const Row = certificate.credential_url ? "a" : "div";
            const linkProps = certificate.credential_url
              ? { href: certificate.credential_url, target: "_blank" as const, rel: "noopener noreferrer" }
              : {};
            return (
              <Row key={certificate.id} className="certificate-row" {...linkProps}>
                <span className="certificate-row__index">0{index + 1}</span>
                <div className="certificate-row__body">
                  <span className="certificate-row__type">Professional credential</span>
                  <h3 className="certificate-row__title">{certificate.title}</h3>
                  <p className="certificate-row__issuer">{certificate.issuer}</p>
                </div>
                <span className="certificate-row__date">
                  <small>Issued</small>
                  <time dateTime={certificate.issue_date}>{formatDate(certificate.issue_date)}</time>
                </span>
                <span className="certificate-row__arrow" aria-hidden="true">↗</span>
              </Row>
            );
          })}
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
