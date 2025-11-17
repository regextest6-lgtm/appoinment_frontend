"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardOverview } from "@/components/admin/dashboard-overview"
import { DoctorsManagement } from "@/components/admin/doctors-management"
import { DepartmentsManagement } from "@/components/admin/departments-management"
import { ServicesManagement } from "@/components/admin/services-management"
import { AppointmentsManagement } from "@/components/admin/appointments-management"
import { MessagesManagement } from "@/components/admin/messages-management"
import { AnalyticsView } from "@/components/admin/analytics-view"
import { SettingsView } from "@/components/admin/settings-view"

type MenuType = "dashboard" | "doctors" | "departments" | "services" | "appointments" | "messages" | "analytics" | "settings"
type ActionType = "overview" | "register" | "view" | "add" | null

export default function AdminDashboard() {
  const [currentMenu, setCurrentMenu] = useState<MenuType>("dashboard")
  const [currentAction, setCurrentAction] = useState<ActionType>("overview")

  const handleMenuClick = (menu: string, action?: string) => {
    setCurrentMenu(menu as MenuType)
    setCurrentAction((action as ActionType) || "view")
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar onMenuClick={handleMenuClick} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="hidden lg:block">
            <h2 className="text-sm font-semibold text-slate-600">
              {currentMenu.charAt(0).toUpperCase() + currentMenu.slice(1)} Management
            </h2>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center font-bold text-white">
              A
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-full">
            {/* Dashboard */}
            {currentMenu === "dashboard" && <DashboardOverview />}

            {/* Doctors */}
            {currentMenu === "doctors" && <DoctorsManagement action={currentAction} />}

            {/* Departments */}
            {currentMenu === "departments" && <DepartmentsManagement action={currentAction} />}

            {/* Services */}
            {currentMenu === "services" && <ServicesManagement action={currentAction} />}

            {/* Appointments */}
            {currentMenu === "appointments" && <AppointmentsManagement />}

            {/* Messages */}
            {currentMenu === "messages" && <MessagesManagement />}

            {/* Analytics */}
            {currentMenu === "analytics" && <AnalyticsView />}

            {/* Settings */}
            {currentMenu === "settings" && <SettingsView />}
          </div>
        </main>
      </div>
    </div>
  )
}
