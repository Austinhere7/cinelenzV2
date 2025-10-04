import { Card, CardContent } from "@/components/ui/card"

export function TechnologySection() {
  return (
    <section id="how-it-works" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">How It Works</h2>
          <p className="text-gray-300 max-w-3xl mx-auto font-space-mono">
            CineLenz detects threads, analyzes sentiment, and visualizes momentum across platforms.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-red-500/20">
            <CardContent className="pt-6">
              <h3 className="text-white font-orbitron text-xl mb-2">1) Detect Threads</h3>
              <p className="text-gray-300 font-space-mono">
                We embed posts and cluster them into unified conversations like “Trailer reactions” or “VFX debate.”
              </p>
            </CardContent>
          </Card>
          <Card className="border-red-500/20">
            <CardContent className="pt-6">
              <h3 className="text-white font-orbitron text-xl mb-2">2) Score Sentiment</h3>
              <p className="text-gray-300 font-space-mono">
                Each thread is labeled positive, negative, or neutral so you can gauge audience mood at a glance.
              </p>
            </CardContent>
          </Card>
          <Card className="border-red-500/20">
            <CardContent className="pt-6">
              <h3 className="text-white font-orbitron text-xl mb-2">3) Show Momentum</h3>
              <p className="text-gray-300 font-space-mono">
                See how buzz grows and fades over time with clean timeline visuals and spike alerts.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
