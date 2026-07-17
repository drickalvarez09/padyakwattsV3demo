import Link from "next/link";
import LandingHeader from "@/components/LandingHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";
import AnimatedStat from "@/components/AnimatedStat";
import { ACCENTS, type AccentColor } from "@/lib/colorTokens";

const FEATURES: { icon: string; color: AccentColor; title: string; desc: string }[] = [
  {
    icon: "fa-bicycle",
    color: "green",
    title: "Pedal-Powered Charging",
    desc: "Convert physical energy into electricity with our efficient pedal generator system.",
  },
  {
    icon: "fa-cogs",
    color: "blue",
    title: "Energy Conversion",
    desc: "Advanced conversion system that transforms pedal motion into usable electrical power.",
  },
  {
    icon: "fa-chart-line",
    color: "teal",
    title: "Real-Time Monitoring",
    desc: "Track energy generation, CO\u2082 savings, and personal contributions in real-time.",
  },
  {
    icon: "fa-shield-alt",
    color: "yellow",
    title: "Emergency Ready",
    desc: "Built-in battery backup for uninterrupted power during emergencies and outages.",
  },
];

const GOALS = [
  { emoji: "\u{1F331}", title: "Clean Energy Access", desc: "Provide free, sustainable energy in public spaces worldwide" },
  { emoji: "\u{1F6B4}\u200D\u2642\uFE0F", title: "Human-Powered Energy", desc: "Promote health and sustainability through pedal-powered generation" },
  { emoji: "\u{1F6E1}\uFE0F", title: "Disaster Resilience", desc: "Emergency-ready charging solutions for critical situations" },
  { emoji: "\u{1F30D}", title: "Community Impact", desc: "Scalable solutions empowering communities globally" },
];

const USE_CASES: { icon: string; color: AccentColor; title: string; desc: string }[] = [
  {
    icon: "fa-bus",
    color: "green",
    title: "Public Transit Hubs",
    desc: "Installed in waiting sheds and terminals, commuters can charge devices while waiting for transportation, turning idle time into productive energy generation.",
  },
  {
    icon: "fa-school",
    color: "blue",
    title: "Educational Institutions",
    desc: "Schools and universities use PADYAKWATTS for practical energy education, sustainable power, and hands-on learning about renewable energy technologies.",
  },
  {
    icon: "fa-first-aid",
    color: "red",
    title: "Emergency Response",
    desc: "During disasters and emergencies, provides critical power for communication devices, medical equipment, and emergency lighting when traditional power fails.",
  },
];

const IMPACT_STATS: { label: string; value: string; width: number; color: AccentColor }[] = [
  { label: "Today's Energy Generated", value: "850 Wh", width: 75, color: "green" },
  { label: "CO\u2082 Reduction", value: "42.5 kg", width: 60, color: "teal" },
  { label: "Active Users", value: "512", width: 85, color: "blue" },
];

const CONTACT_CARDS: { icon: string; color: AccentColor; title: string; l1: string; l2: string }[] = [
  { icon: "fa-map-marker-alt", color: "green", title: "Our Location", l1: "123 Clean Energy Ave", l2: "Green City, GC 1234" },
  { icon: "fa-phone", color: "blue", title: "Contact Number", l1: "+1 (234) 567-8900", l2: "Mon-Fri, 9AM-6PM" },
  { icon: "fa-envelope", color: "teal", title: "Email Address", l1: "info@padyakwatts.com", l2: "support@padyakwatts.com" },
];

export default function LandingPage() {
  return (
    <>
      <LandingHeader />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Hero */}
        <section className="relative rounded-3xl overflow-hidden mb-20" id="overview">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-teal-50 to-blue-50" />
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-green-300/30 rounded-full blur-3xl animate-pulse-glow" />
          <div
            className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-300/30 rounded-full blur-3xl animate-pulse-glow"
            style={{ animationDelay: "1.2s" }}
          />

          <div className="relative flex flex-col-reverse md:flex-row items-center gap-12 p-8 md:p-12">
            <div className="md:w-1/2">
              <Reveal direction="up">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm mb-6">
                  <i className="fas fa-bolt mr-2 animate-pulse" />
                  Clean Energy Revolution
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="gradient-text">Pedal Power</span>
                  <br />
                  <span className="text-gray-800">for a</span>{" "}
                  <span className="gradient-text">Sustainable Future</span>
                </h2>

                <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                  Transform your physical energy into clean electricity. Charge devices, reduce
                  your carbon footprint, and power communities with every pedal stroke.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link href="/login" className="btn-energy px-8 py-4 text-lg">
                    <i className="fas fa-play mr-3" />
                    Start Generating
                  </Link>
                  <Link
                    href="/signup"
                    className="group px-8 py-4 border-2 border-green-600 text-green-600 rounded-full font-semibold hover:bg-green-600 hover:text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-user-plus mr-3 transition-transform duration-300 group-hover:scale-125" />
                    Join Now
                  </Link>
                </div>
              </Reveal>

              <Reveal direction="up" delay={150}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    ["500+", "Active Users"],
                    ["2.5K+", "Wh Generated"],
                    ["120Kg", "CO\u2082 Saved"],
                    ["15", "Installations"],
                  ].map(([value, label]) => (
                    <SpotlightCard key={label} className="stats-card rounded-xl" glow="rgba(16,185,129,0.3)">
                      <div className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          <AnimatedStat value={value} />
                        </div>
                        <div className="text-sm text-gray-600">{label}</div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal direction="right" className="md:w-1/2 relative">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  src="/img/landing1.png"
                  alt="PADYAKWATTS Station"
                />

                <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl animate-float border border-green-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-bolt text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-green-700">Live Energy</div>
                      <div className="text-sm text-gray-600">Generating now</div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl animate-float border border-teal-100"
                  style={{ animationDelay: "1.5s" }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                      <i className="fas fa-leaf text-teal-600" />
                    </div>
                    <div>
                      <div className="font-bold text-teal-700">CO\u2082 Saved</div>
                      <div className="text-sm text-gray-600">120g today</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Features */}
        <section className="mb-20" id="features">
          <Reveal>
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Innovative Features</h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Experience the future of clean energy generation with our cutting-edge technology
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => {
              const tone = ACCENTS[f.color];
              return (
                <Reveal key={f.title} delay={i * 90}>
                  <SpotlightCard
                    glow={tone.glow}
                    className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-full"
                  >
                    <div
                      className={`w-16 h-16 rounded-xl ${tone.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                    >
                      <i className={`fas ${f.icon} text-2xl ${tone.iconText}`} />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">{f.title}</h4>
                    <p className="text-gray-600 mb-6">{f.desc}</p>
                    <div className="flex items-center text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500">
                      <span className="mr-2">Learn More</span>
                      <i className="fas fa-arrow-right" />
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Goals */}
        <section className="mb-20" id="goals">
          <Reveal>
            <div className="bg-gradient-to-br from-green-500 via-teal-500 to-emerald-600 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: "radial-gradient(circle at 20% 20%, white 0, transparent 45%), radial-gradient(circle at 80% 70%, white 0, transparent 40%)"
              }} />
              <div className="relative max-w-6xl mx-auto text-center text-white z-10">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Our Sustainable Mission</h3>
                <p className="text-lg text-white/90 mb-12 max-w-3xl mx-auto">
                  Driving change through innovative clean energy solutions for a sustainable future
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {GOALS.map((g, i) => (
                    <Reveal key={g.title} delay={i * 90}>
                      <div className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl h-full">
                        <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                          {g.emoji}
                        </div>
                        <div className="pt-12">
                          <h4 className="text-xl font-semibold mb-4">{g.title}</h4>
                          <p className="text-white/80 text-sm leading-relaxed">{g.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <div className="mt-16">
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-full font-bold text-lg hover:bg-gray-50 hover:scale-105 hover:shadow-2xl transition-all duration-300"
                  >
                    <i className="fas fa-hands-helping mr-3" />
                    Join Our Mission
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Use Cases */}
        <section className="mb-20" id="usecase">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <Reveal direction="left">
                <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                  Transformative Applications
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Discover how PADYAKWATTS is powering communities and creating sustainable impact
                  across various sectors.
                </p>
              </Reveal>

              <div className="space-y-8">
                {USE_CASES.map((u, i) => {
                  const tone = ACCENTS[u.color];
                  return (
                    <Reveal key={u.title} direction="left" delay={i * 100}>
                      <SpotlightCard
                        glow={tone.glow}
                        tilt={false}
                        className="group flex items-start space-x-6 p-6 rounded-2xl bg-white shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                      >
                        <div className={`w-16 h-16 rounded-xl ${tone.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                          <i className={`fas ${u.icon} text-2xl ${tone.iconText}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-800 mb-3">{u.title}</h4>
                          <p className="text-gray-600 mb-4">{u.desc}</p>
                          <div className="flex items-center text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500">
                            <span className="mr-2">View Case Study</span>
                            <i className="fas fa-arrow-right" />
                          </div>
                        </div>
                      </SpotlightCard>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            <Reveal direction="right" className="sticky top-24">
              <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 shadow-xl border border-green-100">
                <div className="text-center mb-8">
                  <div className="energy-orb mx-auto mb-4 animate-pulse-glow" style={{ width: 56, height: 56 }}>
                    <i className="fas fa-bolt text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">Live Impact Tracker</h4>
                  <p className="text-gray-600 text-sm">
                    Real-time statistics of our collective energy generation
                  </p>
                </div>

                <div className="space-y-8">
                  {IMPACT_STATS.map((stat) => {
                    const tone = ACCENTS[stat.color];
                    return (
                      <div key={stat.label}>
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${tone.dot} mr-3`} />
                            <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                          </div>
                          <span className={`text-lg font-bold ${tone.text}`}>
                            <AnimatedStat value={stat.value} />
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${tone.gradientFrom} ${tone.gradientTo} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${stat.width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <i className="fas fa-user-plus mr-2" />
                    Start Contributing Now
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section className="mb-20" id="contact">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Get In Touch</h3>
                <p className="text-lg text-gray-600">
                  Interested in PADYAKWATTS or want to collaborate? We&apos;d love to hear from you.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                {CONTACT_CARDS.map((c, i) => {
                  const tone = ACCENTS[c.color];
                  return (
                    <Reveal key={c.title} direction="left" delay={i * 100}>
                      <SpotlightCard
                        glow={tone.glow}
                        className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                      >
                        <div className={`w-16 h-16 rounded-xl ${tone.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                          <i className={`fas ${c.icon} text-2xl ${tone.iconText}`} />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">{c.title}</h4>
                        <p className="text-gray-600 mb-4">
                          {c.l1}
                          <br />
                          {c.l2}
                        </p>
                      </SpotlightCard>
                    </Reveal>
                  );
                })}
              </div>

              <div className="lg:col-span-2">
                <Reveal direction="right" className="sticky top-24">
                  <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 shadow-xl border border-green-100">
                    <div className="text-center mb-8">
                      <div className="energy-orb mx-auto mb-4 animate-pulse-glow" style={{ width: 56, height: 56 }}>
                        <i className="fas fa-envelope text-white" />
                      </div>
                      <h4 className="text-2xl font-bold text-gray-800 mb-2">Send Us a Message</h4>
                      <p className="text-gray-600 text-sm">
                        Fill out the form below and we&apos;ll get back to you within 24 hours.
                      </p>
                    </div>

                    <ContactForm />
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
