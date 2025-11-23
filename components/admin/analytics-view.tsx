"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export function AnalyticsView() {
  return (
    <div className="p-6 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
        <p className="text-slate-600 mt-2">View hospital statistics and reports</p>
      </motion.div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <p className="text-center text-slate-500">Analytics coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}
