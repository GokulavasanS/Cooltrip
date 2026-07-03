export default function MapEmbed() {
  const embedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8375226987343!2d80.27071147479786!3d13.052854587252625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267d7b4888889%3A0x3af0571a86b4e0f1!2sAnna%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1720000000000!5m2!1sen!2sin";

  return (
    <div className="glass overflow-hidden p-2">
      <iframe
        src={embedUrl}
        width="100%"
        height="280"
        style={{ border: 0, borderRadius: "16px" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="CoolTrips Office Location"
      />
    </div>
  );
}
