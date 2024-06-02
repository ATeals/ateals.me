import React from "react";
import SITE_CONFIG from "../config/SITE_CONFIG";

export function LogoComponent() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5 }}>
      <img src={SITE_CONFIG.LOGO} alt="logo" width={40} height={40} />
    </div>
  );
}
