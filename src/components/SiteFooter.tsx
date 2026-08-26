import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

export default function SiteFooter() {
  return (
    <footer className="bg-gradient-to-br from-green-600 via-teal-600 to-emerald-700 text-white">
      <div className="max-w-full mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="energy-orb">
                  <i className="fas fa-bolt" />
                </div>
                <h2 className="text-2xl font-bold">PADYAKWATTS</h2>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                Powering communities with clean, sustainable energy through innovative
                pedal-powered solutions.
              </p>
              <div className="flex space-x-4">
                {["facebook-f", "twitter", "instagram", "linkedin-in"].map((icon) => (
                  <a
                    key={icon}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                    href="#"
                  >
                    <i className={`fab fa-${icon}`} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a className="text-white/80 hover:text-white transition-all duration-300" href="#overview">
                    Overview
                  </a>
                </li>
                <li>
                  <a className="text-white/80 hover:text-white transition-all duration-300" href="#features">
                    Features
                  </a>
                </li>
                <li>
                  <a className="text-white/80 hover:text-white transition-all duration-300" href="#usecase">
                    Use Cases
                  </a>
                </li>
                <li>
                  <Link className="text-white/80 hover:text-white transition-all duration-300" href="/login">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Resources</h3>
              <ul className="space-y-3">
                {["Documentation", "API Reference", "Community", "Blog"].map((label) => (
                  <li key={label}>
                    <a className="text-white/80 hover:text-white transition-all duration-300" href="#">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
              <p className="text-white/80 mb-6">
                Stay updated with our latest innovations and sustainability tips.
              </p>
              <NewsletterForm />
              <p className="mt-4 text-white/60 text-sm">Join 2,500+ subscribers</p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/20 text-center space-y-4">
            <p className="text-white/70">
              © 2024 PADYAKWATTS. All rights reserved. |{" "}
              <a className="text-white/80 hover:text-white hover:underline" href="#">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a className="text-white/80 hover:text-white hover:underline" href="#">
                Terms of Service
              </a>
            </p>
            <p className="text-white/60 italic flex items-center justify-center">
              <i className="fas fa-leaf text-green-300 mr-2" />
              Powering a greener tomorrow, one pedal at a time.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
