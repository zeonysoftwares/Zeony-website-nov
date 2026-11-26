"use client";

import React from "react";
import AdminSectionManager from "@/components/admin/AdminSectionManager";

export default function ClientsAdminPage() {
  return (
    <AdminSectionManager
      sectionKey="clients"
      title="Clients & Brands (Image 2)"
      subtitle="Manage the innovative brand logos displayed on the homepage scrolling ticker."
      fields={[
        { key: "title", label: "Brand / Client Name", placeholder: "e.g., Wise Capital, PMC Tech...", required: true, type: "text" },
        { key: "subtitle", label: "Industry Category", placeholder: "e.g., Finance & Trading, Education...", type: "text" },
        { key: "img", label: "Logo URL (/img/...)", placeholder: "/img/wise-capital-logo.png, /img/pmc.jpg...", required: true, type: "text" }
      ]}
    />
  );
}
