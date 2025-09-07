import { Header } from "@/components/layout/header"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCampaigns } from "@/components/home/featured-campaigns"
import LeaderboardWidget from "@/components/gamification/leaderboard-widget"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedCampaigns />
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Impact</h2>
                <p className="text-xl text-gray-600">See how our amazing donors are making a difference</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <LeaderboardWidget />
                </div>
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Join the Movement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-emerald-600">1</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Find a Cause</h4>
                        <p className="text-sm text-gray-600">Browse campaigns that matter to you</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-blue-600">2</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Make a Donation</h4>
                        <p className="text-sm text-gray-600">Support with any amount you can</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl font-bold text-purple-600">3</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Earn Recognition</h4>
                        <p className="text-sm text-gray-600">Climb the leaderboard and unlock achievements</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
