import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <Link href="/">
      <button
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="tracking-wider uppercase text-xs font-medium">Back to Hub</span>
      </button>
    </Link>
  );
}
