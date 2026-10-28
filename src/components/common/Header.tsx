import React, { useState } from 'react';
import { Phone, ArrowRight, Menu, X, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Container } from './Container';
import { Button } from './Button';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top micro-bar for direct contact & assurance */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 border-b border-slate-800">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="hidden sm:inline text-slate-300">
              Licensed & Professional Relocation Services
            </span>
            <span className="sm:hidden text-slate-300">Professional Relocations</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline text-slate-400">
              Hours: {siteConfig.contact.operatingHours}
            </span>
            <a
              href={siteConfig.contact.phoneRaw}
              className="inline-flex items-center gap-1.5 text-white hover:text-amber-400 transition-colors font-medium"
              id="topbar-call-link"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{siteConfig.contact.phoneDisplay}</span>
            </a>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar */}
      <Container className="py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2.5 group" id="brand-logo-link">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
            <div className="relative flex items-center justify-center">
              <span className="text-white font-extrabold text-xl tracking-tight">S</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute -bottom-0.5 -right-1" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              Shift<span className="text-amber-600">ora</span>
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mt-0.5">
              Packers &amp; Movers
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
          {siteConfig.navigation.map((item) => {
            const linkProps = {
              to: item.href,
              className: `text-sm font-medium ${item.href.includes('#') ? 'text-amber-600 hover:text-amber-700' : 'text-slate-700 hover:text-amber-600'} transition-colors`,
              onClick: closeMobileMenu,
            };
            return item.label === 'Services' ? (
              <div className="relative group" key={item.label}>
                <Link
                  to={item.href}
                  className="text-sm font-medium text-slate-700 hover:text-amber-600 transition-colors"
                >
                  {item.label}
                </Link>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <ul className="py-2">
                    <li><Link to="/services/residential-relocation" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Residential Relocation</Link></li>
                    <li><Link to="/services/corporate-shifting-service" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Corporate Shifting Service</Link></li>
                    <li><Link to="/services/office-relocation" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Office Relocation</Link></li>
                    <li><Link to="/services/door-to-door-relocation" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Door To Door Relocation</Link></li>
                    <li><Link to="/services/international-relocation" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">International Relocation</Link></li>
                    <li><Link to="/services/car-shifting-by-car-carrier" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Car Shifting By Car Carrier</Link></li>
                    <li><Link to="/services/industrial-relocation" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Industrial Relocation</Link></li>
                    <li><Link to="/services/air-freight" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Air Freight</Link></li>
                    <li><Link to="/services/sea-freight" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Sea Freight</Link></li>
                    <li><Link to="/services/road-freight" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Road Freight</Link></li>
                  </ul>
                </div>
              </div>
            ) : (
              <Link {...linkProps} key={item.label}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-3">
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
            href="#get-quote"
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
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl max-h-screen overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2 pb-4 border-b border-slate-100">
            {siteConfig.navigation.map((item) => {
              if (item.label === 'Services') {
                return (
                  <div key="services-submenu" className="flex flex-col">
                    <Link to="/services/residential-relocation" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-slate-50 hover:text-amber-600">Residential Relocation</Link>
                    <Link to="/services/corporate-shifting-service" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-slate-50 hover:text-amber-600">Corporate Shifting Service</Link>
                    <Link to="/services/office-relocation" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-slate-50 hover:text-amber-600">Office Relocation</Link>
                    <Link to="/services/door-to-door-relocation" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-slate-50 hover:text-amber-600">Door To Door Relocation</Link>
                    <Link to="/services/international-relocation" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-slate-50 hover:text-amber-600">International Relocation</Link>
                    <Link to="/services/car-shifting-by-car-carrier" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-slate-50 hover:text-amber-600">Car Shifting By Car Carrier</Link>
                    <Link to="/services/industrial-relocation" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-slate-50 hover:text-amber-600">Industrial Relocation</Link>
                    <Link to="/services/air-freight" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-slate-50 hover:text-amber-600">Air Freight</Link>
                    <Link to="/services/sea-freight" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-slate-50 hover:text-amber-600">Sea Freight</Link>
                    <Link to="/services/road-freight" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-slate-50 hover:text-amber-600">Road Freight</Link>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className="py-2 px-3 text-base font-medium text-slate-800 rounded-md hover:bg-slate-50 hover:text-amber-600"
                >
                  {item.label}
                </Link>
              );
            })}
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
              href="#get-quote"
              variant="primary"
              fullWidth
              size="md"
              onClick={() => setMobileMenuOpen(false)}
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
