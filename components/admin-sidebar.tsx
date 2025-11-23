"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Plus,
  Eye,
  Droplet,
} from "lucide-react"

interface NavItem {
  label: string
  icon: React.ReactNode
  submenu?: SubMenuItem[]
  action?: () => void
}

interface SubMenuItem {
  label: string
  icon: React.ReactNode
  action: () => void
}

interface AdminSidebarProps {
  onMenuClick: (menu: string, action?: string) => void
}

export function AdminSidebar({ onMenuClick }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>("dashboard")

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      submenu: [
        {
          label: "Overview",
          icon: <BarChart3 className="w-4 h-4" />,
          action: () => onMenuClick("dashboard", "overview"),
        },
      ],
    },
    {
      label: "Doctors",
      icon: <Users className="w-5 h-5" />,
      submenu: [
        {
          label: "Register New Doctor",
          icon: <Plus className="w-4 h-4" />,
          action: () => onMenuClick("doctors", "register"),
        },
        {
          label: "View All Doctors",
          icon: <Eye className="w-4 h-4" />,
          action: () => onMenuClick("doctors", "view"),
        },
      ],
    },
    {
      label: "Departments",
      icon: <Building2 className="w-5 h-5" />,
      submenu: [
        {
          label: "Add Department",
          icon: <Plus className="w-4 h-4" />,
          action: () => onMenuClick("departments", "add"),
        },
        {
          label: "View Departments",
          icon: <Eye className="w-4 h-4" />,
          action: () => onMenuClick("departments", "view"),
        },
      ],
    },
    {
      label: "Services",
      icon: <Briefcase className="w-5 h-5" />,
      submenu: [
        {
          label: "Add Service",
          icon: <Plus className="w-4 h-4" />,
          action: () => onMenuClick("services", "add"),
        },
        {
          label: "View Services",
          icon: <Eye className="w-4 h-4" />,
          action: () => onMenuClick("services", "view"),
        },
      ],
    },
    {
      label: "Appointments",
      icon: <Calendar className="w-5 h-5" />,
      submenu: [
        {
          label: "View All Appointments",
          icon: <Eye className="w-4 h-4" />,
          action: () => onMenuClick("appointments", "view"),
        },
      ],
    },
    {
      label: "Messages",
      icon: <MessageSquare className="w-5 h-5" />,
      submenu: [
        {
          label: "View Messages",
          icon: <Eye className="w-4 h-4" />,
          action: () => onMenuClick("messages", "view"),
        },
      ],
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      submenu: [
        {
          label: "View Analytics",
          icon: <BarChart3 className="w-4 h-4" />,
          action: () => onMenuClick("analytics", "view"),
        },
      ],
    },
    {
      label: "Blood Banks",
      icon: <Droplet className="w-5 h-5" />,
      submenu: [
        {
          label: "Add Blood Bank",
          icon: <Plus className="w-4 h-4" />,
          action: () => onMenuClick("blood-banks", "add"),
        },
        {
          label: "View Blood Banks",
          icon: <Eye className="w-4 h-4" />,
          action: () => onMenuClick("blood-banks", "view"),
        },
      ],
    },
    {
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      submenu: [
        {
          label: "System Settings",
          icon: <Settings className="w-4 h-4" />,
          action: () => onMenuClick("settings", "view"),
        },
      ],
    },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label)
  }

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -320, opacity: 0 },
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-white shadow-lg"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isMobileOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed left-0 top-0 h-screen w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl z-40 lg:static lg:translate-x-0 overflow-y-auto"
      >
        {/* Logo Section */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-8 border-b border-slate-700">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
              HC
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">HealthCare</h1>
              <p className="text-xs text-slate-400">Admin CRM</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <div key={item.label}>
              {/* Menu Item with Submenu */}
              <motion.button
                onClick={() => toggleSubmenu(item.label)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                  expandedMenu === item.label
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <motion.div
                  animate={{ rotate: expandedMenu === item.label ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* Submenu Items */}
              <AnimatePresence>
                {item.submenu && expandedMenu === item.label && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 mt-2 ml-4 border-l-2 border-slate-700 pl-4">
                      {item.submenu.map((subitem) => (
                        <motion.button
                          key={subitem.label}
                          onClick={() => {
                            subitem.action()
                            setIsMobileOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {subitem.icon}
                          <span>{subitem.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-6 border-t border-slate-700" />

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4 border-t border-slate-700">
          <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center font-bold text-white">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-xs text-slate-400">admin@hospital.com</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full gap-2 bg-slate-600 hover:bg-slate-500 text-white border-slate-500 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
