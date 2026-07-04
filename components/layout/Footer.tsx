import Link from "next/link";
import { Plane, Phone, Mail, MapPin, Share2, MessageCircle, Globe, Briefcase } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { NAV_LINKS } from "@/constants/navigation";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="CoolTrips Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your trusted travel partner. We search, compare, and personally book your perfect flight.
            </p>
            <div className="flex gap-3">
              {[Share2, MessageCircle, Globe, Briefcase].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#4F8CFF] flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label="Social media"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href={ROUTES.flights} className="hover:text-white transition-colors">Flight Search</Link>
              </li>
              <li>Group Bookings</li>
              <li>Travel Insurance</li>
              <li>
                <Link href={ROUTES.visa} className="hover:text-white transition-colors">Visa Assistance</Link>
              </li>
              <li>24/7 Support</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[#4F8CFF] shrink-0" />
                <span>24/53, Gopalapuram, 2nd Street,
Thiru.Vi.Ka Nagar, Perambur,
Chennai, Tamil Nadu — 600082</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#4F8CFF] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 99400 33117</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4F8CFF] shrink-0" />
                <a href="mailto:reservation@cooltrip.org" className="hover:text-white transition-colors">
reservation@cooltrip.org,</a>
 <a href="mailto:visa@cooltrip.org" className="hover:text-white transition-colors">
visa@cooltrip.org</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CoolTrips. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
