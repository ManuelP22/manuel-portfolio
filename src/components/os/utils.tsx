import { Mail } from "lucide-react";
import type { App } from "@/lib/app";
import { ContactPage } from "@/Apps/Contact";
import ManuelApp from "@/Apps/About Manuel";

export const menuOptions: App[] = [
{
  id: "about-manuel",
  title: "About Manuel",
  description: "Lo que he construido",
  iconImage: "/images/bunny.png",
  gradient: "from-green-500 to-emerald-700",
  content: <ManuelApp />,
},
  {
    id: "contact",
    title: "Contact",
    description: "Hablemos",
    icon: Mail, // usando componente
    gradient: "from-orange-500 to-orange-700",
    content: <ContactPage />,
  },
];
