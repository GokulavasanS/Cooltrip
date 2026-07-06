const hours = [
  { day: "Monday – Friday", time: "9:00 AM – 8:00 PM" },
  { day: "Saturday", time: "10:00 AM – 6:00 PM" },
  { day: "Sunday", time: "11:00 AM – 4:00 PM" },
  { day: "WhatsApp Support", time: "24 × 7" },
];

export default function BusinessHours() {
  return (
    <div className="glass p-6">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Business Hours</h3>
      <div className="space-y-2">
        {hours.map((h) => (
          <div key={h.day} className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">{h.day}</span>
            <span className={`font-medium ${h.day === "WhatsApp Support" ? "text-green-600 dark:text-green-500" : "text-gray-900 dark:text-white"}`}>
              {h.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
