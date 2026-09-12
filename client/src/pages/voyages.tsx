import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import WorldPage, { type Hotspot } from "@/components/WorldPage";
import SuccessBanner from "@/components/SuccessBanner";
import type { Postcard } from "@shared/schema";

const destinations = [
  { name: "Mars", tagline: "The Red Frontier", desc: "Rust-colored canyons and the tallest volcano in the system." },
  { name: "Europa", tagline: "Ocean Under Ice", desc: "Beneath its icy crust lies an ocean deeper than Earth's." },
  { name: "Titan", tagline: "Lakes of Methane", desc: "The only moon with a thick atmosphere and liquid on its surface." },
  { name: "Venus Cloud City", tagline: "Floating Above Fire", desc: "Habitats suspended 50km high in pleasant temperature zones." },
  { name: "Lunar Resort", tagline: "The Classic Getaway", desc: "Low-gravity spas and Earthrise views since 1962." },
  { name: "Asteroid Belt Cruise", tagline: "Rock Hopping Deluxe", desc: "Drift among ancient space rocks in a luxury cruiser." },
];

interface VoyagesHotspot extends Hotspot {
  showsDestinations?: boolean;
  showsPostcardForm?: boolean;
}

// Hotspots positioned over the voyages travel agency illustration
const hotspots: VoyagesHotspot[] = [
  {
    id: "posters",
    label: "Travel Posters",
    description: "A riot of color blazes across the far wall — hand-painted travel posters in the grand tradition, each one a promise written in chrome and starlight. Mars glows crimson beneath a sky of butterscotch dust; Venus floats in her cloud-palace like a pearl suspended in amber. They make the impossible feel like a weekend getaway.",
    top: "5%", left: "2%", width: "28%", height: "52%",
    indicatorPos: { top: "30%", left: "50%" },
    showsDestinations: true,
  },
  {
    id: "ticket-counter",
    label: "Ticket Counter",
    description: "The brass-and-mahogany counter gleams under fluorescent starlight. A row of departure clocks ticks away the minutes to launch windows across the solar system. Step right up, pick your planet, and send a postcard home — the next rocket clears the stratosphere at dawn, and there's always room for one more dreamer.",
    top: "60%", left: "15%", width: "38%", height: "35%",
    indicatorPos: { top: "40%", left: "50%" },
    showsPostcardForm: true,
  },
  {
    id: "astronaut",
    label: "Captain Cosmo — Travel Agent",
    description: "Fifty years in the interplanetary travel business and Captain Cosmo still gets a chill when a rocket clears the stratosphere. He's logged two hundred voyages, knows the best crater-side hotels on the Moon, and can tell you which of Saturn's rings catches the light just right at sunset. If there's a corner of the solar system worth visiting, he's already booked the return trip.",
    top: "10%", left: "35%", width: "22%", height: "48%",
    indicatorPos: { top: "25%", left: "50%" },
  },
  {
    id: "rocket-window",
    label: "Launch Window",
    description: "Through the reinforced duralloy observation port, a gleaming chrome rocket stands fueled and ready on the launch pad, her swept-back fins catching the morning sun like polished silver. Wisps of liquid oxygen curl from the booster vents in the pre-dawn chill. Next departure: 0600 hours sharp — don't be late, the cosmos waits for no one.",
    top: "5%", left: "60%", width: "38%", height: "50%",
    indicatorPos: { top: "40%", left: "50%" },
  },
  {
    id: "brochure-rack",
    label: "Brochure Rack",
    description: "A spinning wire rack stuffed with colorful pamphlets, each one more tantalizing than the last. 'Titan: Methane Lakes & Starlit Nights' promises romance under orange skies. 'Europa: Dive the Deep' dares you to explore an alien ocean. Grab a handful — every brochure is a ticket to a daydream you didn't know you needed.",
    top: "60%", left: "58%", width: "38%", height: "35%",
    indicatorPos: { top: "40%", left: "50%" },
  },
];

const inputClass =
  "w-full px-3 py-2 text-sm bg-[hsl(38,30%,85%)] text-[hsl(25,40%,15%)] border-2 border-[hsl(30,20%,68%)] rounded focus:border-[hsl(195,65%,38%)] focus:outline-none";

export default function Voyages() {
  const [selectedDest, setSelectedDest] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

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
      setShowSuccess(true);
    },
  });

  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [showSuccess]);

  const renderPanelContent = (hs: VoyagesHotspot) => {
    // Travel Posters → destination cards
    if (hs.showsDestinations) {
      return (
        <div className="space-y-2">
          <h3 className="pulp-title text-sm text-[hsl(195,65%,38%)] tracking-wider">Destinations</h3>
          <div className="grid grid-cols-2 gap-2">
            {destinations.map(dest => (
              <div key={dest.name} className="comic-panel p-3 bg-[hsl(38,35%,88%)]">
                <span className="pulp-title text-xs text-[hsl(25,40%,15%)]">{dest.name}</span>
                <span className="block text-xs text-[hsl(195,65%,38%)] font-bold mt-0.5">{dest.tagline}</span>
                <p className="text-xs text-[hsl(25,20%,40%)] mt-1">{dest.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Ticket Counter → postcard form
    if (hs.showsPostcardForm) {
      return (
        <div className="space-y-3">
          <h3 className="pulp-title text-sm text-[hsl(195,65%,38%)] tracking-wider">Send a Postcard</h3>
          <div className="flex flex-wrap gap-2">
            {destinations.map(dest => (
              <button
                key={dest.name}
                onClick={() => setSelectedDest(dest.name)}
                className={`text-xs px-3 py-1.5 rounded border-2 transition-all pulp-title tracking-wide ${
                  selectedDest === dest.name
                    ? "border-[hsl(195,65%,38%)] bg-[hsl(195,65%,38%)] text-white"
                    : "border-[hsl(30,20%,68%)] bg-[hsl(38,30%,85%)] text-[hsl(25,40%,20%)] hover:border-[hsl(195,65%,50%)]"
                }`}
                data-testid={`button-dest-${dest.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {dest.name}
              </button>
            ))}
          </div>
          {selectedDest && (
            <>
              <input
                placeholder="Your name (Commander, Cosmonaut...)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                data-testid="input-postcard-name"
              />
              <textarea
                placeholder={`Greetings from ${selectedDest}! Wish you were here...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
                data-testid="input-postcard-message"
              />
              <button
                onClick={() => sendPostcard.mutate()}
                disabled={!name.trim() || !message.trim() || sendPostcard.isPending}
                className="retro-btn teal text-sm"
                data-testid="button-send-postcard"
              >
                {sendPostcard.isPending ? "Sending..." : "★ Send Postcard"}
              </button>
            </>
          )}

          {showSuccess && <SuccessBanner />}

          {/* Postcard wall */}
          {postcards.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="pulp-title text-xs text-[hsl(0,72%,48%)] tracking-wider">
                Postcard Wall ({postcards.length} sent)
              </h4>
              {postcards.map(pc => (
                <div key={pc.id} className="comic-panel p-3 bg-[hsl(38,35%,88%)]" data-testid={`card-postcard-${pc.id}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[hsl(195,65%,38%)] tracking-wider uppercase pulp-title">
                      {pc.destination}
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(25,40%,15%)] leading-relaxed">{pc.message}</p>
                  <p className="text-xs text-[hsl(25,15%,50%)] mt-1">— {pc.visitorName}</p>
                </div>
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
      title="Cosmic Voyages"
      world="Cosmic Voyages"
      sceneSrc="./scenes/voyages-scene.png"
      sceneAlt="Cosmic Voyages travel agency — rocket launch window, travel posters, ticket counter"
      sceneTestId="scene-voyages"
      hint="★ Click the glowing spots to explore the travel agency ★"
      hotspots={hotspots}
      theme={{
        headerBg: "hsl(220,30%,14%)",
        headerBorder: "hsl(195,65%,38%)",
        panelHeaderBg: "hsl(195, 65%, 38%)",
      }}
      renderPanelContent={renderPanelContent}
    />
  );
}
