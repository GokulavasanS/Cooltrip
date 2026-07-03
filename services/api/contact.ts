import { ContactSchema } from "@/lib/validators";

/** Submit contact form — currently logs; wire to DB/email in production */
export async function submitContact(data: ContactSchema): Promise<void> {
  // TODO: POST to /api/contact → save to DB via Prisma
  console.log("Contact form submitted:", data);
  await new Promise((r) => setTimeout(r, 800)); // simulate latency
}
