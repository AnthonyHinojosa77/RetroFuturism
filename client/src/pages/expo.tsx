import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { getVisitorId } from "@/lib/visitor";
import WorldPage, { type Hotspot } from "@/components/WorldPage";
import VoteCard from "@/components/VoteCard";
import SuccessBanner from "@/components/SuccessBanner";
import type { Prediction } from "@shared/schema";

const exhibits = [
  { name: "The Jet-Pack Commuter", icon: "🚀", desc: "Personal flight devices for daily travel — no more traffic jams." },
  { name: "Robot Butler Service", icon: "🤖", desc: "Automated household helpers for cooking, cleaning, and childcare." },
  { name: "Atomic Home Reactor", icon: "⚛️", desc: "A pocket-sized nuclear reactor powers your entire home for pennies." },
  { name: "Videophone Exchange", icon: "📺", desc: "See the face of anyone you call, anywhere in the world." },
  { name: "Moon Colony Alpha", icon: "🌙", desc: "Permanent lunar settlement with schools, shops, and parks." },
  { name: "The Moving Sidewalk", icon: "🛤️", desc: "City-wide conveyor walkways replace buses — walk at 30mph." },
];

interface ExpoHotspot extends Hotspot {
  exhibitIndex?: number;
  showsPredictionForm?: boolean;
}

// Hotspots positioned over the expo illustration
const hotspots: ExpoHotspot[] = [
  {
    id: "jetpack",
    label: "Jet-Pack Demonstration",
    description: "A brave volunteer straps on the JP-3000 and lifts off the exhibit floor to thunderous applause. Twin hydrogen jets roar to life, painting blue-white contrails across the inside of the geodesic dome. The crowd cranes their necks as he banks, spirals, and touches down again with the casual grace of a man stepping off a streetcar. The future of commuting, ladies and gentlemen — no traffic, no trains, just sky.",
    top: "10%", left: "2%", width: "22%", height: "55%",
    indicatorPos: { top: "35%", left: "50%" },
    exhibitIndex: 0,
  },
  {
    id: "robot-butler",
    label: "Robot Butler Pavilion",
    description: "The RB-9 Household Companion glides across the pavilion floor, serving canapés with mechanical precision and a courteous bow of its chrome dome. It can vacuum your parlor, prepare a four-course dinner, and read your children to sleep with a voice like warm brass. The sign above the display reads: 'WHY DO IT YOURSELF WHEN SCIENCE CAN DO IT BETTER?'",
    top: "15%", left: "26%", width: "20%", height: "50%",
    indicatorPos: { top: "30%", left: "50%" },
    exhibitIndex: 1,
  },
  {
    id: "time-capsule",
    label: "The Time Capsule",
    description: "A gleaming titanium vault sunk three feet into the exhibition floor, its surface engraved with the atomic symbol and the words 'TO BE OPENED — 2050 A.D.' Inside, the predictions of today's visitors will sleep alongside newspaper clippings and a bottle of Lunar Lemonade. What will the world look like in twenty-five years? Flying cars? Colonies on Mars? Seal your prediction and let the future be the judge.",
    top: "50%", left: "30%", width: "40%", height: "35%",
    indicatorPos: { top: "40%", left: "50%" },
    showsPredictionForm: true,
  },
  {
    id: "moon-colony",
    label: "Moon Colony Alpha Model",
    description: "Under a spotlight the size of a dinner plate, a meticulous scale model of humanity's first permanent lunar settlement stretches across a table twelve feet long. Tiny geodesic domes cluster around a central plaza, connected by pressurized walkways. Miniature hydroponic farms glow green under artificial sunlight, and if you lean close, you can see a little school with windows facing Earth — so the children never forget where they came from.",
    top: "5%", left: "50%", width: "25%", height: "42%",
    indicatorPos: { top: "40%", left: "50%" },
    exhibitIndex: 4,
  },
  {
    id: "videophone",
    label: "Videophone of Tomorrow",
    description: "Pick up the sleek Bakelite receiver and a six-inch screen flickers to life in glorious Technicolor. See the face of anyone you call, anywhere in the world — your mother in Peoria, your colleague on the Moon relay station, or the operator on Mars with the three-minute light delay. The future of communication is here, and it fits right on your desk.",
    top: "15%", left: "76%", width: "22%", height: "45%",
    indicatorPos: { top: "35%", left: "50%" },
    exhibitIndex: 3,
  },
];

const inputClass =
  "w-full px-3 py-2 text-sm bg-[hsl(38,30%,85%)] text-[hsl(25,40%,15%)] border-2 border-[hsl(30,20%,68%)] rounded focus:border-[hsl(45,80%,48%)] focus:outline-none";

export default function Expo() {
  const [name, setName] = useState("");
  const [prediction, setPrediction] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

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
      const res = await apiRequest("POST", `/api/predictions/${id}/vote`, { visitorId: getVisitorId() });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/predictions"] });
    },
  });

  const renderPanelContent = (hs: ExpoHotspot) => {
    // Exhibit hotspots show their exhibit detail card
    if (hs.exhibitIndex !== undefined) {
      const exhibit = exhibits[hs.exhibitIndex];
      return (
        <div className="comic-panel p-4 bg-[hsl(38,35%,88%)] flex items-start gap-3">
          <span className="text-3xl">{exhibit.icon}</span>
          <div>
            <span className="pulp-title text-sm text-[hsl(25,40%,15%)]">{exhibit.name}</span>
            <p className="text-xs text-[hsl(25,20%,40%)] mt-1">{exhibit.desc}</p>
          </div>
        </div>
      );
    }

    // Time Capsule → prediction form
    if (hs.showsPredictionForm) {
      return (
        <div className="space-y-3">
          <h3 className="pulp-title text-sm text-[hsl(45,80%,42%)] tracking-wider">Seal Your Prediction</h3>
          <p className="text-xs text-[hsl(25,15%,42%)]">What does the future hold? Leave your prediction in the Time Capsule.</p>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            data-testid="input-prediction-name"
          />
          <textarea
            placeholder="By the year 2050, I predict that..."
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
            data-testid="input-prediction-text"
          />
          <button
            onClick={() => submitPrediction.mutate()}
            disabled={!name.trim() || !prediction.trim() || submitPrediction.isPending}
            className="retro-btn gold text-sm"
            data-testid="button-submit-prediction"
          >
            {submitPrediction.isPending ? "Sealing..." : "★ Seal in Capsule"}
          </button>

          {showSuccess && <SuccessBanner />}

          {/* Predictions */}
          {predictions.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="pulp-title text-xs text-[hsl(0,72%,48%)] tracking-wider">
                Predictions ({predictions.length})
              </h4>
              {predictions.map(pred => (
                <VoteCard
                  key={pred.id}
                  votes={pred.votes}
                  onVote={() => voteMutation.mutate(pred.id)}
                  isPending={voteMutation.isPending}
                  cardTestId={`card-prediction-${pred.id}`}
                  voteTestId={`button-vote-prediction-${pred.id}`}
                >
                  <p className="text-sm text-[hsl(25,40%,15%)] leading-relaxed">{pred.prediction}</p>
                  <p className="text-xs text-[hsl(25,15%,50%)] mt-1">— {pred.visitorName}</p>
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
      title="The Atomic Expo"
      world="The Atomic Expo"
      sceneSrc="./scenes/expo-scene.png"
      sceneAlt="The Atomic Expo — City of Tomorrow with jetpack demo, robot butler, moon colony, videophone"
      sceneTestId="scene-expo"
      hint="★ Click the glowing spots to explore the expo ★"
      hotspots={hotspots}
      theme={{
        headerBg: "hsl(42,35%,16%)",
        headerBorder: "hsl(45,80%,48%)",
        panelHeaderBg: "hsl(45, 80%, 48%)",
        panelHeaderColor: "hsl(25, 40%, 12%)",
        panelCloseClass: "text-[hsl(25,40%,20%)] hover:text-black text-lg leading-none",
      }}
      renderPanelContent={renderPanelContent}
    />
  );
}
