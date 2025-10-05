"use client"

export function ApplicationsTimeline() {
  const data = [
    {
      title: "Medical Restoration",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Revolutionary treatment for paralysis, spinal cord injuries, and neurodegenerative diseases. Restore motor
            function and independence to millions worldwide.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Quadriplegia and paraplegia recovery
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              ALS and Parkinson's symptom management
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Stroke rehabilitation acceleration
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Cognitive Enhancement",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Amplify human intelligence, memory, and learning capabilities. Direct neural interfaces for enhanced
            cognitive performance and information processing.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Memory enhancement and recall optimization
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Accelerated learning and skill acquisition
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Real-time language translation
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Digital Integration",
      content: (
        <div>
          <p className="text-white text-sm md:text-base font-normal mb-6 leading-relaxed">
            Seamless connection between human consciousness and digital systems. Control devices, access information,
            and communicate through thought alone.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Thought-controlled device operation
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Direct internet and cloud access
            </div>
            <div className="flex items-center gap-3 text-red-400 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Telepathic communication networks
            </div>
          </div>
        </div>
      ),
    },
  ]

  return null
}
