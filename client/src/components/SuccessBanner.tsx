/** "TRANSMISSION RECEIVED!" confirmation flash shown after a successful submission. */
export default function SuccessBanner() {
  return (
    <div className="text-center py-2 animate-fade-in">
      <span className="pulp-title text-[hsl(45,80%,48%)] text-lg tracking-wider drop-shadow-sm">
        TRANSMISSION RECEIVED!
      </span>
    </div>
  );
}
