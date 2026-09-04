import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Rocket, Send, Globe, MapPin } from "lucide-react";
import type { Postcard } from "@shared/schema";

const destinations = [
  { name: "Mars", tagline: "The Red Frontier", color: "hsl(12, 55%, 55%)", emoji: "🔴", desc: "Rust-colored canyons and the tallest volcano in the system." },
  { name: "Europa", tagline: "Ocean Under Ice", color: "hsl(200, 50%, 45%)", emoji: "🧊", desc: "Beneath its icy crust lies an ocean deeper than Earth's." },
  { name: "Titan", tagline: "Lakes of Methane", color: "hsl(45, 70%, 50%)", emoji: "🪐", desc: "The only moon with a thick atmosphere and liquid on its surface." },
  { name: "Venus Cloud City", tagline: "Floating Above Fire", color: "hsl(40, 60%, 55%)", emoji: "☁️", desc: "Habitats suspended 50km high in pleasant temperature zones." },
  { name: "Lunar Resort", tagline: "The Classic Getaway", color: "hsl(220, 10%, 60%)", emoji: "🌙", desc: "Low-gravity spas and Earthrise views since 1962." },
  { name: "Asteroid Belt Cruise", tagline: "Rock Hopping Deluxe", color: "hsl(280, 30%, 50%)", emoji: "☄️", desc: "Drift among ancient space rocks in a luxury cruiser." },
];

export default function Voyages() {
  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const { data: postcards = [] } = useQuery<Postcard[]>({
    queryKey: ["/api/postcards"],
    refetchInterval: 5000,
  });

  const sendPostcard = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/postcards", {
        visitorName: name,
        destination: selectedDest,
        message,
        createdAt: new Date().toISOString(),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/postcards"] });
      setMessage("");
      setName("");
      setSelectedDest(null);
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[hsl(220,30%,12%)] to-[hsl(200,25%,18%)] text-white pb-12 pt-6 px-4">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(174, 65%, 35%, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 30%, hsl(200, 50%, 45%, 0.2) 0%, transparent 40%)',
        }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <BackButton />
          <div className="flex items-center gap-4 mt-6 mb-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
              <Rocket className="w-8 h-8" />
            </div>
            <div>
              <h1 className="retro-title text-2xl md:text-3xl tracking-wider">Cosmic Voyages</h1>
              <p className="text-white/60 text-sm tracking-widest uppercase">Interplanetary Tourism Bureau</p>
            </div>
          </div>
          <p className="text-white/70 text-sm max-w-lg mt-2">
            Pick a destination. Send a postcard. See where others have traveled.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 pb-16">
        {/* Destinations Grid */}
        <section className="mb-10">
          <h2 className="retro-title text-sm text-muted-foreground tracking-widest mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" /> Choose Your Destination
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {destinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => setSelectedDest(dest.name)}
                data-testid={`button-dest-${dest.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                  selectedDest === dest.name
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border/40 bg-card hover:border-border hover:shadow-sm"
                }`}
              >
                <div className="text-2xl mb-2">{dest.emoji}</div>
                <div className="retro-title text-sm text-foreground">{dest.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{dest.tagline}</div>
                <p className="text-xs text-muted-foreground/70 mt-2 leading-relaxed">{dest.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Send Postcard Form */}
        {selectedDest && (
          <section className="mb-10">
            <div className="retro-card">
              <h2 className="retro-title text-sm text-foreground tracking-widest mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" /> Send a Postcard from {selectedDest}
              </h2>
              <div className="flex flex-col gap-3">
                <Input
                  placeholder="Your name (Commander, Cosmonaut, etc.)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50"
                  data-testid="input-postcard-name"
                />
                <Textarea
                  placeholder={`Greetings from ${selectedDest}! Wish you were here...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="bg-background/50 resize-none"
                  data-testid="input-postcard-message"
                />
                <Button
                  onClick={() => sendPostcard.mutate()}
                  disabled={!name.trim() || !message.trim() || sendPostcard.isPending}
                  className="self-end"
                  data-testid="button-send-postcard"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendPostcard.isPending ? "Sending..." : "Send Postcard"}
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Postcard Wall */}
        <section>
          <h2 className="retro-title text-sm text-muted-foreground tracking-widest mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Postcard Wall ({postcards.length} sent)
          </h2>
          {postcards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Rocket className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No postcards yet. Be the first to send one.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {postcards.map((pc) => {
                const dest = destinations.find(d => d.name === pc.destination);
                return (
                  <div
                    key={pc.id}
                    className="bg-card border border-border/40 rounded-xl p-4 relative overflow-hidden"
                    data-testid={`card-postcard-${pc.id}`}
                  >
                    <div className="absolute top-0 right-0 text-4xl opacity-10 p-2">
                      {dest?.emoji || "🚀"}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-primary tracking-wider uppercase">
                        {pc.destination}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-2">{pc.message}</p>
                    <p className="text-xs text-muted-foreground">
                      — {pc.visitorName}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
