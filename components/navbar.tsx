"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Menu, X, LogOut, User } from "lucide-react"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user, userType, logout, isLoading } = useAuth()

  // Public links - always visible
  const publicNavLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/doctors", label: "Doctors List" },
    { href: "/departments", label: "Departments" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ]

  // Protected links - only visible when logged in
  const protectedNavLinks = [
    { href: "/ambulance-services", label: "Ambulance" },
    { href: "/eye-products", label: "Eye Products" },
    { href: "/blood-banks", label: "Blood Banks" },
  ]

  // Combine links based on login status
  const navLinks = !isLoading && user ? [...publicNavLinks, ...protectedNavLinks] : publicNavLinks

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsOpen(false)
  }

  const getDashboardLink = () => {
    switch (userType) {
      case "patient":
        return "/dashboard/patient"
      case "doctor":
        return "/dashboard/doctor"
      case "admin":
        return "/dashboard/admin"
      default:
        return "/"
    }
  }

  return (
    <header className="sticky top-0 z-50 container mx-auto border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

        {/* Desktop Navigation - Always visible */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
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

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!isLoading && user ? (
            <>
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link href={getDashboardLink()}>
                  <User size={18} />
                  Dashboard
                </Link>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </Button>
            </>
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {!isLoading && user ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Link href={getDashboardLink()}>
                    <User size={18} />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link href="/auth/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
