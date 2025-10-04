import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessagesSquare, Smile, Activity, Search, Globe, Bell } from "lucide-react"

const features = [
  {
    title: "Thread Detection",
    description: "Automatically groups similar posts into coherent discussion threads using embeddings.",
    icon: MessagesSquare,
    badge: "NLP",
  },
  {
    title: "Sentiment & Emotion",
    description: "Capture audience mood — positive, negative, neutral — across platforms at a glance.",
    icon: Smile,
    badge: "Insights",
  },
  {
    title: "Timeline Visualization",
    description: "Watch buzz grow, peak, and fade with clear temporal trend lines.",
    icon: Activity,
    badge: "Trends",
  },
  {
    title: "Search Anything",
    description: "Type any movie or event to surface live or recent social threads instantly.",
    icon: Search,
    badge: "Realtime",
  },
  {
    title: "Cross‑Platform Ingestion",
    description: "Aggregate from X (Twitter), Reddit, and YouTube to unify conversation.",
    icon: Globe,
    badge: "Multi‑source",
  },
  {
    title: "Alerts & Reports",
    description: "Get alerts for spikes and weekly summaries for your titles.",
    icon: Bell,
    badge: "Monitoring",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 font-sans">CineLenz Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            See the conversation around films clearly—organized threads, mood, and momentum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="glow-border hover:shadow-lg transition-all duration-300 slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="text-foreground" size={24} />
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
