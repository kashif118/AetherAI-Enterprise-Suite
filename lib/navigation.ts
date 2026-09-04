import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  FolderKanban,
  LayoutDashboard,
  Library,
  MessagesSquare,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Rendered as a pill on the right of the sidebar row. */
  badge?: string;
  description: string;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

export const APP_NAV: NavSection[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Usage, projects and activity at a glance",
      },
      {
        label: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        description: "Adoption, spend and model performance",
      },
    ],
  },
  {
    id: "build",
    label: "Build",
    items: [
      {
        label: "AI Workspace",
        href: "/workspace",
        icon: Bot,
        description: "Multi-model workspace with files and tools",
      },
      {
        label: "AI Chat",
        href: "/chat",
        icon: MessagesSquare,
        badge: "3",
        description: "Quick, focused conversations",
      },
      {
        label: "Prompt Library",
        href: "/prompts",
        icon: Library,
        description: "Reusable, governed prompt templates",
      },
      {
        label: "Projects",
        href: "/projects",
        icon: FolderKanban,
        description: "Group work, members and budgets",
      },
    ],
  },
  {
    id: "organization",
    label: "Organization",
    items: [
      {
        label: "Team",
        href: "/team",
        icon: Users,
        description: "Members, roles and invitations",
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Workspace, security and billing",
      },
      {
        label: "Profile",
        href: "/profile",
        icon: UserRound,
        description: "Your details and preferences",
      },
    ],
  },
];

export const FLAT_NAV: NavItem[] = APP_NAV.flatMap((section) => section.items);

/** Longest-prefix match so nested routes keep their parent highlighted. */
export function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export const MARKETING_NAV = [
  { label: "Product", href: "/#product" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Security", href: "/#security" },
  { label: "Pricing", href: "/#pricing" },
];

export const FOOTER_NAV: { title: string; links: { label: string; href: string }[] }[] =
  [
    {
      title: "Product",
      links: [
        { label: "AI Workspace", href: "/workspace" },
        { label: "Prompt Library", href: "/prompts" },
        { label: "Analytics", href: "/analytics" },
        { label: "Projects", href: "/projects" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/#product" },
        { label: "Customers", href: "/#customers" },
        { label: "Careers", href: "/#product" },
        { label: "Contact", href: "/#cta" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/#product" },
        { label: "Security", href: "/#security" },
        { label: "Status", href: "/#product" },
        { label: "Changelog", href: "/#product" },
      ],
    },
  ];
