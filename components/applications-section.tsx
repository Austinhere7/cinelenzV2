import { Card, CardContent } from "@/components/ui/card"

export function ApplicationsSection() {
  const applications = [
    {
      title: "Medical Restoration",
      description: "Help paralyzed individuals control computers, phones, and robotic limbs through thought alone.",
      icon: "🧠",
    },
    {
      title: "Cognitive Enhancement",
      description:
        "Augment human memory, processing speed, and learning capabilities through direct neural interfaces.",
      icon: "⚡",
    },
    {
      title: "Communication",
      description: "Enable direct brain-to-brain communication and thought-based text input at superhuman speeds.",
      icon: "💭",
    },
    {
      title: "Sensory Restoration",
      description: "Restore sight to the blind and hearing to the deaf through direct neural stimulation.",
      icon: "👁️",
    },
    {
      title: "Mental Health",
      description: "Treat depression, anxiety, and other neurological conditions with precision neural modulation.",
      icon: "🌟",
    },
    {
      title: "Research & Discovery",
      description: "Unlock the mysteries of consciousness and accelerate neuroscience research.",
      icon: "🔬",
    },
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-orbitron">Transformative Applications</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-space-mono">
            Neural Link technology opens unprecedented possibilities for human enhancement, medical treatment, and
            scientific discovery.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {applications.map((app, index) => (
            <Card
              key={index}
              className="bg-gray-900/80 border-red-500/30 backdrop-blur-sm hover:border-red-500 hover:bg-gray-800/80 transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="text-4xl mb-4">{app.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4 font-orbitron">{app.title}</h3>
                <p className="text-gray-300 font-space-mono">{app.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
