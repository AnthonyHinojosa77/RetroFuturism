import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Atom, ThumbsUp, Lightbulb, Clock, Zap } from "lucide-react";
import type { Prediction } from "@shared/schema";

const exhibits = [
  { name: "The Jet-Pack Commuter", icon: "🚀", desc: "Personal flight devices for daily travel — no more traffic jams." },
  { name: "Robot Butler Service", icon: "🤖", desc: "Automated household helpers for cooking, cleaning, and childcare." },
  { name: "Atomic Home Reactor", icon: "⚛️", desc: "A pocket-sized nuclear reactor powers your entire home for pennies." },
  { name: "Videophone Exchange", icon: "📺", desc: "See the face of anyone you call, anywhere in the world." },
  { name: "Moon Colony Alpha", icon: "🌙", desc: "Permanent lunar settlement with schools, shops, and parks." },
  { name: "The Moving Sidewalk", icon: "🛤️", desc: "City-wide conveyor walkways replace buses — walk at 30mph." },
];

export default function Expo() {
  const [name, setName] = useState("");
  const [prediction, setPrediction] = useState("");

  const { data: predictions = [] } = useQuery<Prediction[]>({
    queryKey: ["/api/predictions"],
    refetchInterval: 5000,
  });

  const submitPrediction = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/predictions", {
        visitorName: name,
        prediction,
        createdAt: new Date().toISOString(),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
      setPrediction("");
      setName("");
    },
  });

  const voteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/predictions/${id}/vote`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[hsl(42,35%,22%)] to-[hsl(38,30%,16%)] text-white pb-12 pt-6 px-4">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, hsl(45, 70%, 50%, 0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, hsl(12, 55%, 55%, 0.3) 0%, transparent 40%)',
        }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <BackButton />
          <div className="flex items-center gap-4 mt-6 mb-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
              <Atom className="w-8 h-8" />
            </div>
            <div>
              <h1 className="retro-title text-2xl md:text-3xl tracking-wider">The Atomic Expo</h1>
              <p className="text-white/60 text-sm tracking-widest uppercase">World's Fair of Tomorrow — Est. 1962</p>
            </div>
          </div>
          <p className="text-white/70 text-sm max-w-lg mt-2">
            Explore the exhibits. Then leave your own prediction for the future in the Time Capsule.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 pb-16">
        {/* Exhibits */}
        <section className="mb-10">
          <h2 className="retro-title text-sm text-muted-foreground tracking-widest mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> The Exhibits
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {exhibits.map((ex) => (
              <div
                key={ex.name}
                className="bg-card border border-border/40 rounded-xl p-4 group hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-2">{ex.icon}</div>
                <h3 className="retro-title text-xs text-foreground mb-1">{ex.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{ex.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Time Capsule Form */}
        <section className="mb-10">
          <div className="retro-card">
            <h2 className="retro-title text-sm text-foreground tracking-widest mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[hsl(45,70%,50%)]" /> The Time Capsule
            </h2>
            <p className="text-xs text-muted-foreground mb-4">What does the future hold? Leave your prediction.</p>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50"
                data-testid="input-prediction-name"
              />
              <Textarea
                placeholder="By the year 2050, I predict that..."
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                rows={3}
                className="bg-background/50 resize-none"
                data-testid="input-prediction-text"
              />
              <Button
                onClick={() => submitPrediction.mutate()}
                disabled={!name.trim() || !prediction.trim() || submitPrediction.isPending}
                className="self-end bg-[hsl(45,70%,50%)] hover:bg-[hsl(45,70%,45%)] text-[hsl(42,35%,12%)]"
                data-testid="button-submit-prediction"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                {submitPrediction.isPending ? "Sealing..." : "Seal in Capsule"}
              </Button>
            </div>
          </div>
        </section>

        {/* Predictions Wall */}
        <section>
          <h2 className="retro-title text-sm text-muted-foreground tracking-widest mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Predictions ({predictions.length})
          </h2>
          {predictions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">The Time Capsule is empty. Be the first to leave a prediction.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {predictions.map((pred) => (
                <div
                  key={pred.id}
                  className="bg-card border border-border/40 rounded-xl p-4 flex items-start gap-4"
                  data-testid={`card-prediction-${pred.id}`}
                >
                  <button
                    onClick={() => voteMutation.mutate(pred.id)}
                    disabled={voteMutation.isPending}
                    className="flex flex-col items-center gap-1 shrink-0 mt-1 group"
                    data-testid={`button-vote-prediction-${pred.id}`}
                  >
                    <ThumbsUp className="w-5 h-5 text-muted-foreground group-hover:text-[hsl(45,70%,50%)] transition-colors" />
                    <span className="text-xs font-bold text-foreground">{pred.votes}</span>
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground leading-relaxed">{pred.prediction}</p>
                    <p className="text-xs text-muted-foreground mt-1.5">— {pred.visitorName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
