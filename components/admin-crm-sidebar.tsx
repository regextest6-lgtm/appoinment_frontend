"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  Ambulance,
  Glasses,
} from "lucide-react"

interface AdminCRMSidebarProps {
  currentMenu: string
  onMenuChange: (menu: string) => void
  onActionChange: (action: string) => void
}

export function AdminCRMSidebar({ currentMenu, onMenuChange, onActionChange }: AdminCRMSidebarProps) {
  const router = useRouter()
  const { logout } = useAuth()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>("dashboard")

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      submenu: [
        { label: "Overview", action: "view" },
      ],
    },
    {
      id: "doctors",
      label: "Doctors",
      icon: Users,
      submenu: [
        { label: "Register New Doctor", action: "register" },
        { label: "View All Doctors", action: "view" },
      ],
    },
    {
      id: "departments",
      label: "Departments",
      icon: Building2,
      submenu: [
        { label: "Add Department", action: "add" },
        { label: "View Departments", action: "view" },
      ],
    },
    {
      id: "services",
      label: "Services",
      icon: Briefcase,
      submenu: [
        { label: "Add Service", action: "add" },
        { label: "View Services", action: "view" },
      ],
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      submenu: [
        { label: "View All Appointments", action: "view" },
      ],
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      submenu: [
        { label: "View Messages", action: "view" },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      submenu: [
        { label: "View Analytics", action: "view" },
      ],
    },
    {
      id: "ambulance",
      label: "Ambulance Services",
      icon: Ambulance,
      submenu: [
        { label: "Manage Services", action: "view" },
      ],
    },
    {
      id: "eye-products",
      label: "Eye Products",
      icon: Glasses,
      submenu: [
        { label: "Manage Products", action: "view" },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      submenu: [
        { label: "System Settings", action: "view" },
      ],
    },
  ]

  const handleMenuClick = (menuId: string, action: string = "view") => {
    onMenuChange(menuId)
    onActionChange(action)
    setIsMobileOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId)
  }

  return (
    <>
      {/* Mobile Toggle */}
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
        animate={isMobileOpen ? { x: 0 } : { x: -320 }}
        className="fixed left-0 top-0 h-screen w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl z-40 lg:relative lg:translate-x-0 lg:w-80 overflow-y-auto"
      >
        {/* Logo */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-8 border-b border-slate-700">
          <Link href="/dashboard/admin" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
              HC
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">HealthCare</h1>
              <p className="text-xs text-slate-400">Admin CRM</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentMenu === item.id
            const isExpanded = expandedMenu === item.id

            return (
              <div key={item.id}>
                <motion.button
                  onClick={() => {
                    toggleSubmenu(item.id)
                    handleMenuClick(item.id, item.submenu[0]?.action || "view")
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                {/* Submenu */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 mt-2 ml-4 border-l-2 border-slate-700 pl-4">
                        {item.submenu.map((sub) => (
                          <motion.button
                            key={sub.action}
                            onClick={() => handleMenuClick(item.id, sub.action)}
                            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {sub.action === "register" || sub.action === "add" ? (
                              <Plus className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                            <span>{sub.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-6 border-t border-slate-700" />

        {/* User Profile */}
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
