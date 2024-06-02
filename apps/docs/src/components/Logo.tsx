import React from "react";
import siteConfig from "../config/siteConfig";

export function LogoComponent() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5 }}>
      <img src={siteConfig.LOGO} alt="logo" width={40} height={40} />
    </div>
  );
}
