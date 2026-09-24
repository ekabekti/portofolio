import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  download?: boolean;
  disabled?: boolean;
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

function buttonClass(variant: "primary" | "outline" | "quiet", className: string) {
  return `button button--${variant} ${className}`;
}

export function SignalButton({
  children,
  href,
  onClick,
  className = "",
  type = "button",
  download = false,
  disabled = false,
}: ButtonProps) {
  const classes = buttonClass("primary", className);
  const content = (
    <>
      <span>{children}</span>
      <span className="button__arrow" aria-hidden="true">↗</span>
    </>
  );

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        className={classes}
        download={download || undefined}
        aria-disabled={disabled || undefined}
        target={isExternalHref(href) ? "_blank" : undefined}
        rel={isExternalHref(href) ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}

export function GhostButton({
  children,
  href,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const classes = buttonClass("outline", className);
  const content = (
    <>
      <span>{children}</span>
      <span className="button__arrow" aria-hidden="true">↗</span>
    </>
  );

  if (href) {
    return (
      <a
        href={disabled ? undefined : href}
        className={classes}
        aria-disabled={disabled || undefined}
        target={isExternalHref(href) ? "_blank" : undefined}
        rel={isExternalHref(href) ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}

export function QuietButton({ children, href, onClick, className = "" }: ButtonProps) {
  const classes = buttonClass("quiet", className);
  const content = (
    <>
      <span>{children}</span>
      <span className="button__arrow" aria-hidden="true">↗</span>
    </>
  );

  if (href) return <a href={href} className={classes}>{content}</a>;
  return <button type="button" onClick={onClick} className={classes}>{content}</button>;
}
