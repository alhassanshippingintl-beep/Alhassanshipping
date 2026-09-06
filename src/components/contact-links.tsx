import { Phone } from "lucide-react";
import { COMPANY, contactHref, type ContactChannel } from "@/lib/company";
import { cn } from "@/lib/utils";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.55 2 2.06 6.48 2.06 12c0 1.76.46 3.48 1.34 5L2 22l5.17-1.35A9.93 9.93 0 0 0 12.04 22c5.5 0 9.98-4.48 9.98-10 0-2.67-1.04-5.18-2.97-7.09zM12.04 20.15c-1.6 0-3.17-.43-4.54-1.25l-.33-.2-3.07.8.82-2.99-.21-.34a8.18 8.18 0 0 1-1.26-4.37c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4a8.15 8.15 0 0 1 2.4 5.8c0 4.52-3.68 8.2-8.2 8.2zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.12-.56.12-.17.25-.64.8-.79.96-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.17.21-.58.21-1.07.14-1.17-.06-.11-.23-.17-.48-.29z" />
    </svg>
  );
}

export function PhoneNumber({ value, className }: { value: string; className?: string }) {
  return (
    <bdi dir="ltr" className={cn("inline-block font-mono tracking-tight whitespace-nowrap", className)}>
      {value}
    </bdi>
  );
}

export function ContactLink({
  channel,
  className,
}: {
  channel: ContactChannel;
  className?: string;
}) {
  const wa = channel.kind === "whatsapp";
  return (
    <a
      href={contactHref(channel)}
      className={cn("inline-flex items-center gap-2", className)}
      target={wa ? "_blank" : undefined}
      rel={wa ? "noreferrer" : undefined}
    >
      {wa ? <WhatsAppIcon className="size-3.5 shrink-0 text-ok" /> : <Phone className="size-3.5 shrink-0 text-brand-soft" />}
      <span>{channel.label}</span>
      <PhoneNumber value={channel.display} />
    </a>
  );
}

export function ContactList({ className, itemClassName }: { className?: string; itemClassName?: string }) {
  return (
    <div className={className}>
      {COMPANY.phones.map((p) => (
        <ContactLink key={p.e164} channel={p} className={itemClassName} />
      ))}
    </div>
  );
}
