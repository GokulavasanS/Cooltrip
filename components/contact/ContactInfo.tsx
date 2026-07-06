import { MapPin, Phone, Mail, Share2, MessageCircle, Globe, Briefcase } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="glass p-7">
      <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6">Get in Touch</h2>

      <div className="space-y-5">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F8CFF]/10 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-5 h-5 text-[#4F8CFF]" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">Office Address</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              24/53, Gopalapuram, 2nd Street,<br />
              Thiru.Vi.Ka Nagar, Perambur,<br />
              Chennai, Tamil Nadu — 600082
            </div>
          </div>
        </div>

        {/* Mobile No */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F8CFF]/10 flex items-center justify-center shrink-0 mt-0.5">
            <Phone className="w-5 h-5 text-[#4F8CFF]" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">Mobile</div>
            <a href="tel:+919940033117" className="block text-[#4F8CFF] text-sm hover:underline">
              +91 99400 33117
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F8CFF]/10 flex items-center justify-center shrink-0 mt-0.5">
            <Phone className="w-5 h-5 text-[#4F8CFF]" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">Phone</div>
            <a href="tel:+918098586276" className="block text-[#4F8CFF] text-sm hover:underline">
              +91 80985 86276
            </a>
            <a href="tel:+919345363526" className="block text-[#4F8CFF] text-sm hover:underline">
              +91 93453 63526
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4F8CFF]/10 flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="w-5 h-5 text-[#4F8CFF]" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">Email</div>
            <a href="mailto:reservation@cooltrip.org" className="block text-[#4F8CFF] text-sm hover:underline break-all">
              reservation@cooltrip.org
            </a>
            <a href="mailto:cooltripconsultant@gmail.com" className="block text-[#4F8CFF] text-sm hover:underline break-all">
              cooltripconsultant@gmail.com
            </a>
            <a href="mailto:visa@cooltrip.org" className="block text-[#4F8CFF] text-sm hover:underline break-all">
              visa@cooltrip.org
            </a>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
        <div className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Follow Us</div>
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
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-[#4F8CFF]/10 hover:text-[#4F8CFF] text-gray-500 dark:text-gray-400 flex items-center justify-center transition-all"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
