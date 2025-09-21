import { FolderOpen, Mail, User } from "lucide-react";
import type { App } from "@/lib/app";
import { AboutPage } from "@/pages/About";
import { ContactPage } from "@/pages/Contact";
import { ProjectsPage } from "@/pages/Projects";

export const menuOptions: App[] = [
  {
    id: "about",
    title: "About",
    description: "Quién soy",
    icon: User,
    gradient: "from-purple-500 to-purple-700",
    content: <AboutPage />,
  },
  {
    id: "projects",
    title: "Projects",
    description: "Lo que he construido",
    icon: FolderOpen,
    gradient: "from-green-500 to-emerald-700",
    content: <ProjectsPage />,
  },
  {
    id: "contact",
    title: "Contact",
    description: "Hablemos",
    icon: Mail,
    gradient: "from-orange-500 to-orange-700",
    content: <ContactPage />,
  },
];