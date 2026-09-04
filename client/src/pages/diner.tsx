import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UtensilsCrossed, ChefHat, ThumbsUp, Sparkles, Star } from "lucide-react";
import type { MenuItem } from "@shared/schema";

const houseMenu = [
  { name: "Nebula Noodle Soup", price: "3 Credits", desc: "Swirling broth infused with cosmic dust. Glows faintly." },
  { name: "Saturn Ring Onion Rings", price: "2 Credits", desc: "Deep-fried in zero-gravity oil. Perfectly circular every time." },
  { name: "Meteor Meatloaf", price: "4 Credits", desc: "Dense, savory, and impacts your plate with authority." },
  { name: "Lunar Lemonade", price: "1 Credit", desc: "Carbonated citrus from the Moon's hydroponic gardens." },
  { name: "Plutonium Pudding", price: "3 Credits", desc: "Glows green. Tastes like butterscotch. Totally safe." },
  { name: "Galactic Grilled Cheese", price: "2 Credits", desc: "Cheese from six different planets. Melted perfectly." },
];

export default function Diner() {
  const [name, setName] = useState("");
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");

  const { data: communityItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    refetchInterval: 5000,
  });

  const submitDish = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/menu-items", {
        visitorName: name,
        dishName,
        description,
        createdAt: new Date().toISOString(),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setDishName("");
      setDescription("");
      setName("");
    },
  });

  const voteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/menu-items/${id}/vote`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[hsl(350,30%,18%)] to-[hsl(12,25%,14%)] text-white pb-12 pt-6 px-4">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 40% 50%, hsl(12, 55%, 55%, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 30%, hsl(340, 45%, 50%, 0.3) 0%, transparent 40%)',
        }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <BackButton />
          <div className="flex items-center gap-4 mt-6 mb-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <div>
              <h1 className="retro-title text-2xl md:text-3xl tracking-wider">Astro Diner</h1>
              <p className="text-white/60 text-sm tracking-widest uppercase">Orbital Dining & Refreshments</p>
            </div>
          </div>
          <p className="text-white/70 text-sm max-w-lg mt-2">
            Browse our menu. Or invent your own space-age dish and let others vote on it.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 pb-16">
        {/* House Menu */}
        <section className="mb-10">
          <h2 className="retro-title text-sm text-muted-foreground tracking-widest mb-4 flex items-center gap-2">
            <Star className="w-4 h-4" /> House Specials
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {houseMenu.map((item) => (
              <div
                key={item.name}
                className="bg-card border border-border/40 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="retro-title text-xs text-foreground">{item.name}</h3>
                </div>
                <span className="text-xs font-bold text-accent">{item.price}</span>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Your Dish */}
        <section className="mb-10">
          <div className="retro-card">
            <h2 className="retro-title text-sm text-foreground tracking-widest mb-1 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-accent" /> Invent a Dish
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Dream up a space-age creation for the community menu.</p>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Your name (Chef, Space Cook, etc.)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50"
                data-testid="input-dish-chef"
              />
              <Input
                placeholder="Dish name (e.g., Supernova Spaghetti)"
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="bg-background/50"
                data-testid="input-dish-name"
              />
              <Textarea
                placeholder="Describe your creation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="bg-background/50 resize-none"
                data-testid="input-dish-desc"
              />
              <Button
                onClick={() => submitDish.mutate()}
                disabled={!name.trim() || !dishName.trim() || !description.trim() || submitDish.isPending}
                className="self-end bg-accent hover:bg-accent/90 text-white"
                data-testid="button-submit-dish"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {submitDish.isPending ? "Adding..." : "Add to Menu"}
              </Button>
            </div>
          </div>
        </section>

        {/* Community Menu */}
        <section>
          <h2 className="retro-title text-sm text-muted-foreground tracking-widest mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Community Menu ({communityItems.length})
          </h2>
          {communityItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ChefHat className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No community dishes yet. Be the first chef.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {communityItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border/40 rounded-xl p-4 flex items-start gap-4"
                  data-testid={`card-menu-${item.id}`}
                >
                  <button
                    onClick={() => voteMutation.mutate(item.id)}
                    disabled={voteMutation.isPending}
                    className="flex flex-col items-center gap-1 shrink-0 mt-1 group"
                    data-testid={`button-vote-dish-${item.id}`}
                  >
                    <ThumbsUp className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    <span className="text-xs font-bold text-foreground">{item.votes}</span>
                  </button>
                  <div className="min-w-0">
                    <h3 className="retro-title text-sm text-foreground">{item.dishName}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.description}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1.5">— Chef {item.visitorName}</p>
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
