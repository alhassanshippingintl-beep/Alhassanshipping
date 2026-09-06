import type { Testimonial } from "@/lib/testimonials";

export function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5 text-brand" aria-label={`${rating} من 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-brand" : "text-line"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function ReviewCard({ item }: { item: Testimonial }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <Stars rating={item.rating} />
      <p className="mt-4 flex-1 text-sm leading-7 text-ink">«{item.quote}»</p>
      <div className="mt-5 border-t border-line pt-4">
        <div className="font-black">{item.name}</div>
        <div className="text-sm text-muted">{item.role}</div>
        <div className="text-xs text-muted">
          {item.city} · {item.year}
        </div>
      </div>
    </article>
  );
}
