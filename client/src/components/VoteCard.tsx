import type { ReactNode } from "react";

interface VoteCardProps {
  votes: number;
  onVote: () => void;
  isPending: boolean;
  cardTestId: string;
  voteTestId: string;
  children: ReactNode;
}

/** Comic-panel card with a 👍 vote button on the left — used for community predictions and dishes. */
export default function VoteCard({ votes, onVote, isPending, cardTestId, voteTestId, children }: VoteCardProps) {
  return (
    <div className="comic-panel p-3 bg-[hsl(38,35%,88%)] flex items-start gap-3" data-testid={cardTestId}>
      <button
        onClick={onVote}
        disabled={isPending}
        className="flex flex-col items-center gap-0.5 shrink-0 mt-0.5 hover:scale-110 transition-transform"
        data-testid={voteTestId}
      >
        <span className="text-lg">👍</span>
        <span className="text-xs font-bold text-[hsl(25,40%,15%)]">{votes}</span>
      </button>
      <div>{children}</div>
    </div>
  );
}
