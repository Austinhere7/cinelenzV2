import { Card, CardContent } from "@/components/ui/card"

export function FAQSection() {
  const threads = [
    { title: "Thread 1: Fans hyped about the trailer", tone: "Positive" },
    { title: "Thread 2: Critics debating VFX", tone: "Mixed" },
    { title: "Thread 3: Reactions to leaked scenes", tone: "Negative" },
    { title: "Thread 4: Box office predictions", tone: "Neutral/Mixed" },
  ]

  return (
    <section className="py-24 bg-black" id="examples">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">Examples</h2>
          <p className="text-gray-300 max-w-3xl mx-auto font-space-mono">
            Search “Pushpa 2” and see threads like these, updated in real time across platforms.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {threads.map((t, i) => (
            <Card key={i} className="border-red-500/20">
              <CardContent className="pt-6">
                <h3 className="text-white font-orbitron text-lg mb-1">{t.title}</h3>
                <p className="text-gray-400 text-sm font-space-mono">Sentiment snapshot: {t.tone}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
