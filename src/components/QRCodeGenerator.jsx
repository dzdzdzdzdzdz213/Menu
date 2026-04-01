import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ExternalLink } from 'lucide-react';
import './QRCodeGenerator.css';

const QRCodeGenerator = ({ tableId, restaurantName, vendorUrl }) => {
  return (
    <div className="qr-card glass">
      <div className="qr-header">
        <h4 className="qr-title">Digital Menu Access</h4>
        <p className="qr-subtitle">Scan to order from {restaurantName}</p>
      </div>

      <div className="qr-display-container">
        <div className="qr-svg-wrapper">
          <QRCodeSVG 
            value={vendorUrl} 
            size={160} 
            bgColor={"#000000"} 
            fgColor={"#FFFFFF"} 
            level={"Q"} 
            includeMargin={true}
          />
        </div>
      </div>

      {tableId && (
        <div className="qr-table-info">
          Table <span>#{tableId}</span>
        </div>
      )}

      <button className="btn-outline qr-action">
        <ExternalLink size={16} /> Open Link Directly
      </button>
    </div>
  );
};

export default QRCodeGenerator;
