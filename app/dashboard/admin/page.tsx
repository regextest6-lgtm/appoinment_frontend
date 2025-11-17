"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-context"
import { AdminCRMSidebar } from "@/components/admin-crm-sidebar"
import { AdminCRMContent } from "@/components/admin-crm-content"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, userType, isLoading } = useAuth()
  const [currentMenu, setCurrentMenu] = useState("dashboard")
  const [currentAction, setCurrentAction] = useState("view")

  useEffect(() => {
    if (!isLoading && (!user || userType !== "admin")) {
      router.push("/auth/admin")
    }
  }, [user, userType, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading CRM Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || userType !== "admin") {
    return null
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Sidebar */}
      <AdminCRMSidebar 
        currentMenu={currentMenu} 
        onMenuChange={setCurrentMenu}
        onActionChange={setCurrentAction}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 shadow-sm px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-600">
              {currentMenu.charAt(0).toUpperCase() + currentMenu.slice(1)} Management
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
              {user.full_name?.charAt(0) || "A"}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <AdminCRMContent 
            menu={currentMenu} 
            action={currentAction}
          />
        </main>
      </div>
    </div>
  )
}
