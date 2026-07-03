import { MapPin, Phone, Mail, Share2, MessageCircle, Globe, Briefcase } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="glass p-7">
      <h2 className="font-bold text-gray-900 text-xl mb-6">Get in Touch</h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F8CFF]/10 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#4F8CFF]" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm mb-0.5">Office Address</div>
            <div className="text-gray-500 text-sm">
              42, 2nd Cross Street, Anna Nagar<br />
              Chennai, Tamil Nadu — 600040
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F8CFF]/10 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-[#4F8CFF]" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm mb-0.5">Phone</div>
            <a href="tel:+919876543210" className="text-[#4F8CFF] text-sm hover:underline">+91 98765 43210</a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F8CFF]/10 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-[#4F8CFF]" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm mb-0.5">Email</div>
            <a href="mailto:hello@cooltrips.in" className="text-[#4F8CFF] text-sm hover:underline">hello@cooltrips.in</a>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="font-semibold text-gray-900 text-sm mb-3">Follow Us</div>
        <div className="flex gap-2">
          {[
          { Icon: Share2, label: "Share" },
            { Icon: MessageCircle, label: "Twitter/X" },
            { Icon: Globe, label: "Facebook" },
            { Icon: Briefcase, label: "LinkedIn" },
          ].map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-[#4F8CFF]/10 hover:text-[#4F8CFF] text-gray-500 flex items-center justify-center transition-all"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
