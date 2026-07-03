export default function MapEmbed() {
  // Google Maps embed for: 24/53, Gopalapuram 2nd Street, Thiru.Vi.Ka Nagar, Perambur, Chennai 600082
  const embedUrl =
    "https://maps.google.com/maps?q=Perambur,Chennai,Tamil+Nadu+600082&output=embed&z=15";

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
        title="CoolTrips Office Location — Perambur, Chennai"
      />
    </div>
  );
}
