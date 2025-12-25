"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Menu, X, LogOut, User, Ambulance, Eye, Droplets } from "lucide-react"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, userType, logout, isLoading } = useAuth()

  // Public links - always visible
  const publicNavLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/doctors", label: "Doctors List" },
    { href: "/departments", label: "Departments" },
    { href: "/services", label: "Our Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact Us" },
  ]

  // Protected links - only visible when logged in (in hamburger menu)
  const protectedNavLinks = [
    { href: "/ambulance-services", label: "Ambulance", icon: Ambulance },
    { href: "/eye-products", label: "Eye Products", icon: Eye },
    { href: "/blood-banks", label: "Blood Banks", icon: Droplets },
  ]

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsOpen(false)
  }

  const getDashboardLink = () => {
    if (userType === "patient") {
      return "/dashboard/patient"
    }
    return "/"
  }

  return (
    <header className="sticky top-0 z-50 container mx-auto border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
          <div className="relative w-16 h-16 text-xl font-bold text-primary">
            <Image 
              src="/logo.jpeg" 
              alt="logo"
              height={1000}
              width={1000}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Desktop Navigation - Only public links */}
        <nav className="hidden md:flex items-center gap-8">
          {publicNavLinks.map((link) => (
            <div key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-all duration-200 hover:-translate-y-0.5"
              >
                {link.label}
              </Link>
            </div>
          ))}
        </nav>

        {/* Desktop Right Side - Auth Buttons or User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoading && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                aria-label="User menu"
              >
                <Menu size={24} className="text-foreground" />
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="py-2">
                    {/* Protected Links */}
                    {protectedNavLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Icon size={18} className="text-muted-foreground" />
                          {link.label}
                        </Link>
                      )
                    })}

                    {/* Separator */}
                    <div className="border-t border-border my-1" />

                    {/* Dashboard */}
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <User size={18} className="text-muted-foreground" />
                      Dashboard
                    </Link>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-105"
              >
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button
                asChild
                variant="outline"
              >
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden hover:bg-slate-100 p-2 rounded transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {/* Public Links */}
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Separator for logged in users */}
            {!isLoading && user && (
              <>
                <div className="border-t border-border my-2" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  Services
                </p>
                {/* Protected Links */}
                {protectedNavLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors px-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={18} className="text-muted-foreground" />
                      {link.label}
                    </Link>
                  )
                })}
                <div className="border-t border-border my-2" />
                <Button
                  asChild
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}>
                    <User size={18} />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  variant="outline"
                  className="w-full flex items-center gap-2 text-red-600 dark:text-red-400 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </>
            )}

            {/* Auth Buttons for non-logged in users */}
            {!isLoading && !user && (
              <>
                <div className="border-t border-border my-2" />
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>Login</Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
