"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

interface GalleryProps {
  images: string[];
  title: string;
}

/**
 * Animated multi-image gallery with fullscreen lightbox.
 * Keyboard: Esc closes, ←/→ navigates.
 */
export default function Gallery({ images, title }: GalleryProps) {
  const [active, setActive] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (direction: 1 | -1) => {
      setActive((current) =>
        current === null ? current : (current + direction + images.length) % images.length,
      );
    },
    [images.length],
  );

  useEffect(() => {
    if (active === null) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  if (images.length === 0) return null;

  return (
    <div className="gallery-block">
      <div className="gallery-block__heading">
        <span className="mono-label">Gallery / {String(images.length).padStart(2, "0")} images</span>
      </div>
      <div className="gallery-grid">
        {images.map((src, index) => (
          <Reveal key={`${src}-${index}`} delay={Math.min(index * 0.06, 0.3)} y={26}>
            <button
              type="button"
              className="gallery-thumb"
              onClick={() => setActive(index)}
              aria-label={`Buka gambar ${index + 1} dari ${images.length}: ${title}`}
            >
              <Image
                src={src}
                alt={`${title} — gambar ${index + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="gallery-thumb__image"
              />
              <span className="gallery-thumb__zoom" aria-hidden="true">⤢</span>
              <span className="gallery-thumb__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — gambar ${active + 1} dari ${images.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            onClick={close}
          >
            <span className="lightbox__counter" aria-hidden="true">
              {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            <button type="button" className="lightbox__close" onClick={close} aria-label="Tutup pratinjau">
              ✕
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="lightbox__nav lightbox__nav--prev"
                  onClick={(event) => { event.stopPropagation(); step(-1); }}
                  aria-label="Gambar sebelumnya"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="lightbox__nav lightbox__nav--next"
                  onClick={(event) => { event.stopPropagation(); step(1); }}
                  aria-label="Gambar berikutnya"
                >
                  →
                </button>
              </>
            )}
            <motion.figure
              className="lightbox__figure"
              key={images[active]}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={images[active]}
                alt={`${title} — gambar ${active + 1}`}
                fill
                sizes="90vw"
                className="lightbox__image"
                priority
              />
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
