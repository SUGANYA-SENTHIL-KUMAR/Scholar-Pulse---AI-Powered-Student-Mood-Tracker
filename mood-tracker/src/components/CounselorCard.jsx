// src/components/CounselorCard.jsx
import React from "react";

function CounselorCard({ counselor }) {
  const {
    name,
    gender,
    specialization,
    phone,
    email,
    clinic,
    address,
    city,
    timings,
    photo,
  } = counselor;

  // wa.me needs digits only, no "+"
  const whatsappNumber = phone.replace(/[^\d]/g, "");

  return (
    <div className="counselor-card">
      <img className="counselor-photo" src={photo} alt={name} />

      <div className="counselor-info">
        <h3 className="counselor-name">{name}</h3>
        <p className="counselor-detail">
          {gender} • {specialization}
        </p>
        <p className="counselor-detail">{clinic}</p>
        <p className="counselor-detail">
          {address}, {city}
        </p>
        <p className="counselor-detail">🕒 {timings}</p>
        <p className="counselor-detail">📱 {phone}</p>
        <p className="counselor-detail">✉️ {email}</p>

        <div className="counselor-actions">
          <a className="counselor-btn call-btn" href={`tel:${phone}`}>
            📞 Call
          </a>
          <a
            className="counselor-btn whatsapp-btn"
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 WhatsApp
          </a>
          <a className="counselor-btn email-btn" href={`mailto:${email}`}>
            ✉️ Email
          </a>
        </div>
      </div>
    </div>
  );
}

export default CounselorCard;
