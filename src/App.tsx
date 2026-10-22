import React from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResidentialRelocationPage } from './pages/ResidentialRelocationPage';
import { CorporateShiftingServicePage } from './pages/CorporateShiftingServicePage';
import { OfficeRelocationPage } from './pages/OfficeRelocationPage';
import { DoorToDoorRelocationPage } from './pages/DoorToDoorRelocationPage';
import { InternationalRelocationPage } from './pages/InternationalRelocationPage';
import { CarShiftingByCarCarrierPage } from './pages/CarShiftingByCarCarrierPage';
import { IndustrialRelocationPage } from './pages/IndustrialRelocationPage';
import { AirFreightPage } from './pages/AirFreightPage';
import { SeaFreightPage } from './pages/SeaFreightPage';
import { RoadFreightPage } from './pages/RoadFreightPage';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/residential-relocation" element={<ResidentialRelocationPage />} />
            <Route path="/services/corporate-shifting-service" element={<CorporateShiftingServicePage />} />
            <Route path="/services/office-relocation" element={<OfficeRelocationPage />} />
            <Route path="/services/door-to-door-relocation" element={<DoorToDoorRelocationPage />} />
            <Route path="/services/international-relocation" element={<InternationalRelocationPage />} />
            <Route path="/services/car-shifting-by-car-carrier" element={<CarShiftingByCarCarrierPage />} />
            <Route path="/services/industrial-relocation" element={<IndustrialRelocationPage />} />
            <Route path="/services/air-freight" element={<AirFreightPage />} />
            <Route path="/services/sea-freight" element={<SeaFreightPage />} />
            <Route path="/services/road-freight" element={<RoadFreightPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
