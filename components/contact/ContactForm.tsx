"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactSchema } from "@/lib/validators";
import { submitContact } from "@/services/api/contact";
import { CheckCircle, MessageSquare } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactSchema>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactSchema) => {
    await submitContact(data);
    setSent(true);
    reset();
  };

  if (sent) {
    return (
      <div className="glass p-10 text-center">
        <div className="success-icon w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-bold text-gray-900 text-xl mb-2">Message Sent!</h3>
        <p className="text-gray-500 text-sm mb-6">We&apos;ll get back to you within 24 hours.</p>
        <button onClick={() => setSent(false)} className="btn-secondary text-sm px-6 py-2.5">
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="glass p-7">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F8CFF] to-[#62D4E3] flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <h2 className="font-bold text-gray-900 text-xl">Send us a message</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Your Name</label>
            <input {...register("name")} className="input-glass" placeholder="Full name" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input {...register("email")} type="email" className="input-glass" placeholder="you@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mobile Number</label>
          <div className="flex gap-2">
            <span className="input-glass w-16 text-center text-gray-600 font-medium shrink-0">+91</span>
            <input {...register("phone")} type="tel" className="input-glass flex-1" placeholder="9876543210" maxLength={10} />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
          <textarea {...register("message")} className="input-glass resize-none" rows={5} placeholder="How can we help you?" />
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 disabled:opacity-60">
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
