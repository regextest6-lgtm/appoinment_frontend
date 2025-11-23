"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TestCredential {
  role: string
  emoji: string
  phone: string
  password: string
  email: string
  details?: string
}

const TEST_CREDENTIALS: TestCredential[] = [
  {
    role: "Admin User",
    emoji: "🔐",
    phone: "+11234567890",
    password: "Admin@123",
    email: "admin@hospital.com",
  },
  {
    role: "Doctor User",
    emoji: "👨‍⚕️",
    phone: "+11234567891",
    password: "Doctor@123",
    email: "doctor@hospital.com",
    details: "Specialty: Cardiology",
  },
  {
    role: "Patient User",
    emoji: "👤",
    phone: "+11234567892",
    password: "Patient@123",
    email: "patient@hospital.com",
  },
]

export function TestCredentials() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-lg shadow-lg overflow-hidden"
      >
        {/* Header Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🧪</span>
            <span className="font-semibold text-sm text-foreground">Test Credentials</span>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} className="text-muted-foreground" />
          </motion.div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border bg-muted/30 max-h-96 overflow-y-auto"
            >
              <div className="p-4 space-y-3">
                {TEST_CREDENTIALS.map((cred, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-background rounded-lg p-3 border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{cred.emoji}</span>
                      <h4 className="font-semibold text-sm text-foreground">{cred.role}</h4>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Phone */}
                      <div className="flex items-center justify-between gap-2 bg-muted/50 p-2 rounded">
                        <div>
                          <p className="text-muted-foreground">Phone:</p>
                          <p className="font-mono text-foreground">{cred.phone}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(cred.phone, index * 3)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          title="Copy phone"
                        >
                          {copiedIndex === index * 3 ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} className="text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      {/* Password */}
                      <div className="flex items-center justify-between gap-2 bg-muted/50 p-2 rounded">
                        <div>
                          <p className="text-muted-foreground">Password:</p>
                          <p className="font-mono text-foreground">{cred.password}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(cred.password, index * 3 + 1)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          title="Copy password"
                        >
                          {copiedIndex === index * 3 + 1 ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} className="text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      {/* Email */}
                      <div className="flex items-center justify-between gap-2 bg-muted/50 p-2 rounded">
                        <div>
                          <p className="text-muted-foreground">Email:</p>
                          <p className="font-mono text-foreground text-xs">{cred.email}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(cred.email, index * 3 + 2)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          title="Copy email"
                        >
                          {copiedIndex === index * 3 + 2 ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} className="text-muted-foreground" />
                          )}
                        </button>
                      </div>

                      {/* Details if available */}
                      {cred.details && (
                        <div className="bg-blue-50/20 p-2 rounded border border-blue-200/30">
                          <p className="text-blue-700 dark:text-blue-400">{cred.details}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                <div className="bg-yellow-50/20 border border-yellow-200/30 rounded-lg p-2 text-xs text-yellow-700 dark:text-yellow-400">
                  <p className="font-semibold mb-1">💡 Tip:</p>
                  <p>Click any credential to copy it to your clipboard. Use these for testing!</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
