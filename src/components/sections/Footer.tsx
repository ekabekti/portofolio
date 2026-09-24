import type { Profile } from "@/lib/data";

interface FooterProps {
  profile: Profile;
}

const footerLinks = [
  { label: "Tentang", href: "#tentang" },
  { label: "Karya", href: "#proyek" },
  { label: "Kredensial", href: "#sertifikat" },
  { label: "Kontak", href: "#kontak" },
];

export default function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <a href="#top" className="site-footer__wordmark">
          EKABEKTI<span>.</span>
        </a>
        <p className="site-footer__aside">
          Digital systems for the moments that matter. Built with intention, maintained with care.
        </p>
      </div>
      <div className="container site-footer__bottom">
        <span>© {year} {profile.full_name} / Indonesia</span>
        <nav className="site-footer__links" aria-label="Navigasi footer">
          {footerLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
