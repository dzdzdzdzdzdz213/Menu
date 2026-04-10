import React from 'react';
import { Shield, FileText, ChevronRight } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const PublicPolicy = ({ title, date, sections }) => {
  useSEO({ title, description: `${title} for Menu platform.` });

  return (
    <div className="container page-transition" style={{ paddingTop: '8rem', paddingBottom: '6rem', maxWidth: '900px' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <div className="section-label" style={{ marginBottom: '1rem' }}>
          <Shield size={14} /> Legal Documentation
        </div>
        <h1 className="discovery-title" style={{ fontSize: '3.5rem' }}>{title}</h1>
        <p className="text-muted" style={{ marginTop: '1rem' }}>Last Updated: {date}</p>
      </header>

      <div className="policy-content glass" style={{ padding: '3rem', borderRadius: '24px' }}>
        {sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '3rem' }}>
            <h2 className="title-md" style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
              <span className="text-red">0{idx + 1}.</span> {section.heading}
            </h2>
            <p className="text-muted" style={{ lineHeight: '1.8', fontSize: '1.05rem' }}>
              {section.content}
            </p>
          </div>
        ))}

        <div style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Have questions about our terms or your data?</p>
          <button className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
            Contact Legal Team <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Terms = () => (
  <PublicPolicy 
    title="Terms of Service" 
    date="April 2026"
    sections={[
      { heading: "Agreement to Terms", content: "By accessing and using Menu, you agree to be bound by these futuristic Terms of Service and all applicable laws and regulations in the year 2026." },
      { heading: "User Accounts", content: "Users are responsible for maintaining the confidentiality of their digital signatures and account credentials. All biometric data is processed in accordance with our security protocols." },
      { heading: "Ordering & Delivery", content: "Menu acts as an aggregator. Contracts for supply and delivery of food are between the customer and the respective merchant. We ensure the luminous quality of the connection." }
    ]}
  />
);

export const Privacy = () => (
  <PublicPolicy 
    title="Privacy Policy" 
    date="April 2026"
    sections={[
      { heading: "Information Collection", content: "We collect information necessary to provide a high-velocity gastronomic experience, including your preferences, location, and order history." },
      { heading: "Data Protection", content: "Your data is encrypted using 256-bit quantum-resistant protocols. We never share your personal biometric data with third-party advertisers." },
      { heading: "Your Rights", content: "You have the right to access, rectify, or erase your digital footprint on the Menu platform at any time through your dashboard." }
    ]}
  />
);
