'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, LogOut, User, Ambulance, Eye, Droplets, Phone } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, userType, logout, isLoading } = useAuth();

  // Public links - always visible
  const publicNavLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/doctors', label: 'Doctors List' },
    { href: '/departments', label: 'Departments' },
    { href: '/services', label: 'Our Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact Us' },
  ];

  // Protected links - only visible when logged in (in hamburger menu)
  const protectedNavLinks = [
    { href: '/ambulance-services', label: 'Ambulance', icon: Ambulance },
    { href: '/eye-products', label: 'Eye Products', icon: Eye },
    { href: '/blood-banks', label: 'Blood Banks', icon: Droplets },
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsOpen(false);
  };

  const getDashboardLink = () => {
    if (userType === 'patient') {
      return '/dashboard/patient';
    }
    return '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Header Bar - Dark Blue */}
      <div className="w-full bg-linear-to-r from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo and Hospital Info */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-3 hover:opacity-90 transition-opacity"
              >
                <div className="relative w-14 h-14 bg-white rounded-lg p-2 flex items-center justify-center">
                  <Image
                    src="/logo.jpeg"
                    alt="Hospital Logo"
                    height={1500}
                    width={1500}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="hidden sm:block py-2">
                  <h1 className="text-lg md:text-2xl font-bold text-white">
                    Nazmul Modern Hospital
                  </h1>
                  <p className="text-xs md:text-sm text-blue-100">We pledge your TRUST</p>
                </div>
              </Link>
            </div>

            {/* Right Side - Hotline */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <Phone size={20} className="text-white" />
                  <span className="text-sm text-white">Hotline</span>
                </div>
                <p className="text-base md:text-lg font-semibold text-white">+8801312-666677</p>
              </div>
              <div className="md:hidden flex items-center gap-2">
                <Phone size={18} className="text-white" />
                <span className="text-sm font-semibold text-white">+8801312-666677</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Light Blue */}
      <div className="w-full bg-linear-to-r from-blue-600 via-blue-500 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Desktop Navigation - Only public links */}
            <nav className="hidden lg:flex items-center gap-6 flex-1">
              {publicNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-white tracking-wide hover:text-blue-100 transition-colors duration-200 py-2"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Right Side - Auth Buttons or User Menu */}
            <div className="hidden md:flex items-center gap-3">
              {!isLoading && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                    aria-label="User menu"
                  >
                    <Menu size={24} className="text-white" />
                  </button>

                  {/* User Menu Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="py-2">
                        {/* Protected Links */}
                        {protectedNavLinks.map((link) => {
                          const Icon = link.icon;
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
                          );
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
                            handleLogout();
                            setIsUserMenuOpen(false);
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
                    className="bg-white hover:bg-blue-50 text-black transition-all duration-200"
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white text-white bg-white/20 hover:bg-primary"
                  >
                    <Link href="/auth/register">Register</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-linear-to-b from-blue-300 to-blue-500 border-t border-blue-400 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {/* Public Links */}
            {publicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-blue-600 uppercase tracking-wide hover:text-blue-100 transition-colors py-2 px-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Separator for logged in users */}
            {!isLoading && user && (
              <>
                <div className="border-t border-blue-400 my-2" />
                <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider px-2">
                  Services
                </p>
                {/* Protected Links */}
                {protectedNavLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 text-sm font-semibold text-white uppercase tracking-wide hover:text-blue-100 transition-colors px-2 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={18} className="text-blue-100" />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="border-t border-blue-400 my-2" />
                <Button
                  asChild
                  variant="outline"
                  className="w-full flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}>
                    <User size={18} />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  variant="outline"
                  className="w-full flex items-center gap-2 bg-red-500/20 border-red-400/50 text-white hover:bg-red-500/30"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </>
            )}

            {/* Auth Buttons for non-logged in users */}
            {!isLoading && !user && (
              <>
                <div className="border-t border-blue-400 my-2" />
                <Button asChild className="w-full bg-white hover:bg-blue-50 text-blue-600">
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white/20"
                >
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
