"use client"

export default function AmbientBG() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Glow 1 */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl mix-blend-screen bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.35)_0%,transparent_60%)] animate-[drift_16s_ease-in-out_infinite]" />
      {/* Glow 2 */}
      <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl mix-blend-screen bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.25)_0%,transparent_60%)] animate-[drift_22s_ease-in-out_infinite_reverse]" />
      {/* Glow 3 */}
      <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full blur-3xl mix-blend-screen bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.20)_0%,transparent_60%)] animate-[drift_18s_ease-in-out_infinite]" />

      <style jsx>{`
        @keyframes drift {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(10px, -20px, 0) scale(1.05);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
