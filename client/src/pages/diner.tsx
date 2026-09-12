import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { getVisitorId } from "@/lib/visitor";
import WorldPage, { type Hotspot } from "@/components/WorldPage";
import VoteCard from "@/components/VoteCard";
import SuccessBanner from "@/components/SuccessBanner";
import type { MenuItem } from "@shared/schema";

interface DinerHotspot extends Hotspot {
  showsMenu?: boolean;
  showsForm?: boolean;
}

// Hotspots positioned over the diner illustration
const hotspots: DinerHotspot[] = [
  {
    id: "jukebox",
    label: "Atomic Jukebox",
    description: "The Wurlitzer Galaxia stands seven feet tall, its vacuum tubes pulsing amber and violet with every downbeat. It plays hits beamed in from relay stations across the solar system — Martian blues, Venusian swing, the haunting theremin ballads of the outer rim. Drop in a credit and feel the bass rattle the chrome trim on every booth in the joint.",
    top: "25%", left: "2%", width: "22%", height: "55%",
    indicatorPos: { top: "40%", left: "50%" },
  },
  {
    id: "menu-board",
    label: "Today's Specials",
    description: "Hand-lettered every morning by the robot chef in crisp white paint on a slab of polished asteroid. The Nebula Noodle Soup glows a faint cerulean — perfectly safe, they assure you. The daily specials rotate with the station's orbit, so what's fresh depends on which cargo freighter docked last.",
    top: "5%", left: "30%", width: "20%", height: "30%",
    indicatorPos: { top: "50%", left: "50%" },
    showsMenu: true,
  },
  {
    id: "robot-waiter",
    label: "Servo the Robot Waiter",
    description: "Model T-800 hospitality unit, polished to a mirror finish and programmed with the manners of a Lunar Grand Hotel concierge. Servo glides between booths on magnetic rails, balancing six plates on each articulated arm without spilling a drop. Tips aren't required, but leave one and his optical sensors flash a grateful pink.",
    top: "20%", left: "42%", width: "18%", height: "60%",
    indicatorPos: { top: "30%", left: "50%" },
  },
  {
    id: "counter",
    label: "Chrome Counter",
    description: "The counter curves like a rocket's aileron, its chrome surface polished to a mirror finish by Servo's tireless buffing arm every night after closing. Twelve swiveling stools in cherry-red vinyl line the bar, each one worn smooth by a generation of spacers, engineers, and dreamers. Pull up a seat and invent something for the menu — the Diner runs on community spirit and cosmic creativity.",
    top: "55%", left: "25%", width: "50%", height: "25%",
    indicatorPos: { top: "40%", left: "50%" },
    showsForm: true,
  },
  {
    id: "window",
    label: "Observation Window",
    description: "Through the reinforced panoramic viewport, Saturn hangs in the velvet dark like a jeweled crown. The rings catch the sunlight at this angle, splitting it into bands of gold and ivory that stretch across the void. Regulars say the view is worth the trip alone — and they're not wrong. Sip your Lunar Lemonade and watch the cosmos put on a show.",
    top: "5%", left: "70%", width: "28%", height: "35%",
    indicatorPos: { top: "50%", left: "50%" },
  },
];

const houseMenu = [
  { name: "Nebula Noodle Soup", price: "3 Credits", desc: "Swirling broth infused with cosmic dust. Glows faintly." },
  { name: "Saturn Ring Onion Rings", price: "2 Credits", desc: "Deep-fried in zero-gravity oil. Perfectly circular." },
  { name: "Meteor Meatloaf", price: "4 Credits", desc: "Dense, savory, impacts your plate with authority." },
  { name: "Lunar Lemonade", price: "1 Credit", desc: "Carbonated citrus from the Moon's hydroponic gardens." },
  { name: "Plutonium Pudding", price: "3 Credits", desc: "Glows green. Tastes like butterscotch. Totally safe." },
  { name: "Galactic Grilled Cheese", price: "2 Credits", desc: "Cheese from six planets. Melted perfectly." },
];

const inputClass =
  "w-full px-3 py-2 text-sm bg-[hsl(38,30%,85%)] text-[hsl(25,40%,15%)] border-2 border-[hsl(30,20%,68%)] rounded focus:border-[hsl(0,72%,48%)] focus:outline-none";

export default function Diner() {
  const [name, setName] = useState("");
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

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
      setShowSuccess(true);
    },
  });

  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [showSuccess]);

  const voteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/menu-items/${id}/vote`, { visitorId: getVisitorId() });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
    },
  });

  const renderPanelContent = (hs: DinerHotspot) => {
    // Menu Board hotspot reveals the house menu
    if (hs.showsMenu) {
      return (
        <div className="space-y-2">
          <h3 className="pulp-title text-sm text-[hsl(0,72%,48%)] tracking-wider">House Specials</h3>
          <div className="grid grid-cols-2 gap-2">
            {houseMenu.map(item => (
              <div key={item.name} className="comic-panel p-3 bg-[hsl(38,35%,88%)]">
                <div className="flex justify-between items-start gap-1 mb-1">
                  <span className="pulp-title text-xs text-[hsl(25,40%,15%)]">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-[hsl(195,65%,38%)]">{item.price}</span>
                <p className="text-xs text-[hsl(25,20%,40%)] mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Counter hotspot reveals the dish creation form
    if (hs.showsForm) {
      return (
        <div className="space-y-3">
          <h3 className="pulp-title text-sm text-[hsl(0,72%,48%)] tracking-wider">Invent a Dish</h3>
          <p className="text-xs text-[hsl(25,15%,42%)]">Dream up a space-age creation for the community menu.</p>
          <input
            placeholder="Your name (Chef, Space Cook...)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            data-testid="input-dish-chef"
          />
          <input
            placeholder="Dish name (e.g., Supernova Spaghetti)"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            className={inputClass}
            data-testid="input-dish-name"
          />
          <textarea
            placeholder="Describe your creation..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className={`${inputClass} resize-none`}
            data-testid="input-dish-desc"
          />
          <button
            onClick={() => submitDish.mutate()}
            disabled={!name.trim() || !dishName.trim() || !description.trim() || submitDish.isPending}
            className="retro-btn text-sm"
            data-testid="button-submit-dish"
          >
            {submitDish.isPending ? "Adding..." : "★ Add to Menu"}
          </button>

          {showSuccess && <SuccessBanner />}

          {/* Community dishes */}
          {communityItems.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="pulp-title text-xs text-[hsl(195,65%,38%)] tracking-wider">
                Community Menu ({communityItems.length})
              </h4>
              {communityItems.map(item => (
                <VoteCard
                  key={item.id}
                  votes={item.votes}
                  onVote={() => voteMutation.mutate(item.id)}
                  isPending={voteMutation.isPending}
                  cardTestId={`card-menu-${item.id}`}
                  voteTestId={`button-vote-dish-${item.id}`}
                >
                  <span className="pulp-title text-xs text-[hsl(25,40%,15%)]">{item.dishName}</span>
                  <p className="text-xs text-[hsl(25,20%,40%)] mt-0.5">{item.description}</p>
                  <p className="text-xs text-[hsl(25,15%,55%)] mt-1">— Chef {item.visitorName}</p>
                </VoteCard>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null; // generic "FOUND!" discovery
  };

  return (
    <WorldPage
      title="Astro Diner"
      world="Astro Diner"
      sceneSrc="./scenes/diner-scene.png"
      sceneAlt="Inside the Astro Diner — chrome counter, robot waiter, jukebox, observation window"
      sceneTestId="scene-diner"
      hint="★ Click the glowing spots to explore the diner ★"
      hotspots={hotspots}
      theme={{
        headerBg: "hsl(350,30%,14%)",
        headerBorder: "hsl(45,80%,45%)",
      }}
      renderPanelContent={renderPanelContent}
    />
  );
}
