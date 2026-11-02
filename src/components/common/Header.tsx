import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Container } from './Container';
import { Button } from './Button';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

export const serviceLinks = [
  { label: 'Residential Relocation', href: '/services/residential-relocation' },
  { label: 'Corporate Shifting Service', href: '/services/corporate-shifting-service' },
  { label: 'Office Relocation', href: '/services/office-relocation' },
  { label: 'Door-to-Door Relocation', href: '/services/door-to-door-relocation' },
  { label: 'International Relocation', href: '/services/international-relocation' },
  { label: 'Car Shifting by Car Carrier', href: '/services/car-shifting-by-car-carrier' },
  { label: 'Industrial Relocation', href: '/services/industrial-relocation' },
  { label: 'Air Freight', href: '/services/air-freight' },
  { label: 'Sea Freight', href: '/services/sea-freight' },
  { label: 'Road Freight', href: '/services/road-freight' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close menus whenever route changes
  useEffect(() => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Close desktop dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isServiceActive = location.pathname.startsWith('/services/');

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Contact Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 border-b border-slate-800">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="hidden sm:inline text-slate-300">
              Licensed &amp; Professional Relocation Services
            </span>
            <span className="sm:hidden text-slate-300">
              Professional Relocations
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline text-slate-400">
              Hours: {siteConfig.contact.operatingHours}
            </span>
            <a
              href={siteConfig.contact.phoneRaw}
              className="inline-flex items-center gap-1.5 text-white hover:text-amber-400 transition-colors font-semibold"
              id="topbar-call-link"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{siteConfig.contact.phoneDisplay}</span>
            </a>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar */}
      <Container className="py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center shrink-0 group"
          id="brand-logo-link"
          onClick={closeMobileMenu}
          aria-label="TOTER Packers & Movers Home"
        >
          <Logo size="md" theme="light" />
        </Link>

        {/* Desktop Nav Links */}
        <nav
          className="hidden lg:flex items-center gap-6"
          aria-label="Main Navigation"
        >
          {siteConfig.navigation.map((item) =>
            item.label === 'Services' ? (
              <div
                className="relative"
                key={item.label}
                ref={dropdownRef}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setServicesDropdownOpen((prev) => !prev)}
                  aria-expanded={servicesDropdownOpen}
                  aria-haspopup="true"
                  id="desktop-services-dropdown-btn"
                  className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors py-3 cursor-pointer focus:outline-none ${
                    isServiceActive || servicesDropdownOpen
                      ? 'text-amber-600'
                      : 'text-slate-700 hover:text-amber-600'
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      servicesDropdownOpen ? 'rotate-180 text-amber-600' : 'text-slate-500'
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute left-0 top-full pt-1 w-64 transition-all duration-200 z-50 ${
                    servicesDropdownOpen
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                  }`}
                >
                  <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                    <ul className="py-2 max-h-[75vh] overflow-y-auto" role="menu">
                      {serviceLinks.map((service) => (
                        <li key={service.href} role="none">
                          <NavLink
                            to={service.href}
                            role="menuitem"
                            onClick={() => {
                              setServicesDropdownOpen(false);
                              closeMobileMenu();
                            }}
                            className={({ isActive }) =>
                              `block px-4 py-2.5 text-sm font-medium transition-colors ${
                                isActive
                                  ? 'bg-amber-50 text-amber-700 font-semibold'
                                  : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'
                              }`
                            }
                          >
                            {service.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to={item.href}
                key={item.label}
                onClick={closeMobileMenu}
                className={`text-sm font-semibold transition-colors ${
                  item.href.includes('#get-quote')
                    ? 'text-amber-600 hover:text-amber-700'
                    : 'text-slate-700 hover:text-amber-600'
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Button
            href={siteConfig.contact.phoneRaw}
            variant="ghost"
            size="sm"
            icon={<Phone className="w-4 h-4 text-amber-600" />}
            iconPosition="left"
            id="header-call-button"
          >
            Call Now
          </Button>

          <Button
            href="/#get-quote"
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
            id="header-quote-button"
          >
            Get a Free Quote
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="lg:hidden p-2 rounded-lg text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-drawer"
          id="mobile-menu-toggle-btn"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </Container>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200"
        >
          {/* Mobile Drawer Brand Logo */}
          <div className="pb-3 mb-2 border-b border-slate-100 flex items-center justify-between">
            <Link
              to="/"
              onClick={closeMobileMenu}
              aria-label="TOTER Packers & Movers Home"
            >
              <Logo size="sm" theme="light" />
            </Link>
          </div>

          <nav
            className="flex flex-col gap-1 pb-4 border-b border-slate-100"
            aria-label="Mobile Navigation"
          >
            {siteConfig.navigation.map((item) =>
              item.label === 'Services' ? (
                <div key="services-submenu" className="flex flex-col py-1">
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen((prev) => !prev)}
                    aria-expanded={mobileServicesOpen}
                    className="flex items-center justify-between px-3 py-2 text-base font-semibold text-slate-800 rounded-md hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={`w-4 h-4 text-amber-600 transition-transform duration-200 ${
                        mobileServicesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileServicesOpen && (
                    <div className="flex flex-col pl-3 mt-1 border-l-2 border-amber-200 space-y-0.5">
                      {serviceLinks.map((service) => (
                        <NavLink
                          key={service.href}
                          to={service.href}
                          onClick={closeMobileMenu}
                          className={({ isActive }) =>
                            `py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                              isActive
                                ? 'bg-amber-50 text-amber-700 font-semibold'
                                : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'
                            }`
                          }
                        >
                          {service.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className="py-2.5 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="pt-4 flex flex-col gap-3">
            <Button
              href={siteConfig.contact.phoneRaw}
              variant="outline"
              fullWidth
              size="md"
              icon={<Phone className="w-4 h-4 text-amber-600" />}
              iconPosition="left"
              id="mobile-drawer-call-btn"
            >
              Call: {siteConfig.contact.phoneDisplay}
            </Button>

            <Button
              href="/#get-quote"
              variant="primary"
              fullWidth
              size="md"
              onClick={closeMobileMenu}
              icon={<ArrowRight className="w-4 h-4" />}
              id="mobile-drawer-quote-btn"
            >
              Get a Free Quote
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
