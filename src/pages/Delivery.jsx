import React, { useState } from 'react';
import { Bike, ShieldCheck, Map, DollarSign, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import './Delivery.css';

const Delivery = () => {
  const { t } = useApp();
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({ 
    fullName: '', phoneNumber: '', city: '', vehicle: 'motorcycle',
    licenseFile: null, idCardFile: null, isOver18: false
  });

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (formData.fullName.trim() === '' || formData.phoneNumber.trim() === '' || formData.city === '') {
      toast.error("Please fill in all basic required fields.");
      return;
    }

    if ((formData.vehicle === 'car' || formData.vehicle === 'motorcycle') && !formData.licenseFile) {
      toast.error("Please upload a photo of your driver's license.");
      return;
    }

    if (formData.vehicle === 'bicycle' && (!formData.isOver18 || !formData.idCardFile)) {
      toast.error("You must be over 18 and upload a photo of your Identity Card to deliver by bicycle.");
      return;
    }

    // Secure handling simulation
    console.log("Submitting secure fleet application:", formData);
    setIsRegistered(true);
    toast.success("Application successfully submitted!");
  };

  return (
    <div className="delivery-page container">
      {/* Hero Section */}
      <section className="delivery-hero glass">
        <div className="delivery-hero-content">
          <div className="delivery-icon-wrapper">
            <Bike size={48} className="text-red" />
          </div>
          <h2 className="title-lg">{t.deliveryFleet}</h2>
          <p className="hero-subtitle text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            {t.deliverySub}
          </p>
        </div>
      </section>

      {!isRegistered ? (
        <div className="delivery-main-grid">
          {/* Features Column */}
          <div className="delivery-features">
            <div className="feature-card glass">
              <DollarSign size={28} className="text-red" style={{ marginBottom: '1rem' }} />
              <h3 className="title-md">{t.premiumRates}</h3>
              <p className="text-muted">{t.premiumRatesSub}</p>
            </div>
            
            <div className="feature-card glass">
              <Map size={28} className="text-red" style={{ marginBottom: '1rem' }} />
              <h3 className="title-md">{t.smartRouting}</h3>
              <p className="text-muted">{t.smartRoutingSub}</p>
            </div>
            
            <div className="feature-card glass">
              <ShieldCheck size={28} className="text-red" style={{ marginBottom: '1rem' }} />
              <h3 className="title-md">{t.verifiedNetwork}</h3>
              <p className="text-muted">{t.verifiedNetworkSub}</p>
            </div>
          </div>

          {/* Registration Form */}
          <div className="delivery-registration glass">
            <h3 className="title-md" style={{ marginBottom: '1.5rem' }}>{t.driverApp}</h3>
            <form className="registration-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label>{t.fullName}</label>
                <input type="text" name="fullName" placeholder={t.fullName} value={formData.fullName} onChange={handleChange} required />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{t.phoneNumber}</label>
                  <input type="tel" name="phoneNumber" placeholder={t.phoneNumber} value={formData.phoneNumber} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>{t.cityOp}</label>
                  <select name="city" value={formData.city} onChange={handleChange} required>
                    <option value="">{t.selectCity || 'Select City'}...</option>
                    <option value="algiers">Algiers</option>
                    <option value="oran">Oran</option>
                    <option value="tunis">Tunis</option>
                    <option value="casablanca">Casablanca</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>{t.vehicleType}</label>
                <div className="vehicle-options">
                  <label className="vehicle-radio">
                    <input type="radio" name="vehicle" value="motorcycle" checked={formData.vehicle === 'motorcycle'} onChange={handleChange} required />
                    <span>{t.motorcycle}</span>
                  </label>
                  <label className="vehicle-radio">
                    <input type="radio" name="vehicle" value="car" checked={formData.vehicle === 'car'} onChange={handleChange} />
                    <span>{t.car}</span>
                  </label>
                  <label className="vehicle-radio">
                    <input type="radio" name="vehicle" value="bicycle" checked={formData.vehicle === 'bicycle'} onChange={handleChange} />
                    <span>{t.bicycle}</span>
                  </label>
                </div>
              </div>

              {(formData.vehicle === 'car' || formData.vehicle === 'motorcycle') && (
                <div className="form-group slide-in">
                  <label>Driver's License Photo</label>
                  <input type="file" name="licenseFile" accept="image/*" onChange={handleChange} required style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
                  <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>* Upload a clear photo of your valid driver's license.</p>
                </div>
              )}

              {formData.vehicle === 'bicycle' && (
                <div className="form-group slide-in">
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
                    <input type="checkbox" name="isOver18" checked={formData.isOver18} onChange={handleChange} required style={{ width: 'auto', margin: 0 }} />
                    <span style={{ fontSize: '0.95rem' }}>I confirm that I am over 18 years old</span>
                  </label>
                  
                  <label>National Identity Card Photo</label>
                  <input type="file" name="idCardFile" accept="image/*" onChange={handleChange} required style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white', width: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>* Valid ID card photo is required for age verification for bicycle couriers.</p>
                </div>
              )}
              
              <button type="submit" className="btn-primary flex-btn" style={{ marginTop: '1rem', width: '100%', padding: '1rem' }}>
                Submit Application <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
              </button>
              
              <p className="privacy-terms text-muted">
                By applying, you agree to our Terms of Service & Privacy Policy. Background checks may apply.
              </p>
            </form>
          </div>
        </div>
      ) : (
        <div className="delivery-success glass">
           <ShieldCheck size={64} className="text-red" />
           <h2 className="title-lg" style={{ marginTop: '2rem', marginBottom: '1rem' }}>Application Submitted</h2>
           <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '500px' }}>
              Thank you for applying to the Menu Fleet network. Our onboarding team is reviewing your profile and will text you within 24 hours.
           </p>
           <button className="btn-outline" style={{ marginTop: '3rem' }} onClick={() => setIsRegistered(false)}>
              Back to Fleet Home
           </button>
        </div>
      )}
      
      <div className="mobile-nav-spacer"></div>
    </div>
  );
};

export default Delivery;
