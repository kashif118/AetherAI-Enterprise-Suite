import type { Metadata } from "next";
import { ProjectsView } from "@/components/projects/projects-view";

export const metadata: Metadata = {
  title: "Projects",
  description: "Group AI work into projects with members, models and budgets.",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
