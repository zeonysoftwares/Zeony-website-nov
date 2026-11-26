"use client";

import React from "react";
import AdminSectionManager from "@/components/admin/AdminSectionManager";

export default function ServicesAdminPage() {
  return (
    <AdminSectionManager
      sectionKey="services"
      title="IT & Digital Services"
      subtitle="Add and remove core enterprise IT services, consulting offerings, and software capabilities."
      fields={[
        { key: "title", label: "Service Title", placeholder: "e.g., Web Development, Cloud Consulting...", required: true, type: "text" },
        { key: "img", label: "Service Image / Icon URL", placeholder: "/img/web-dev.jpg...", required: true, type: "text" },
        { key: "desc", label: "Service Description", placeholder: "Detailed description of the service...", required: true, type: "textarea" },
        { key: "subServices", label: "Sub Services / Features", placeholder: "", type: "object-array", subFields: [{ key: "name", label: "Sub Service Name", placeholder: "e.g., Frontend Development" }, { key: "detail", label: "Detail/Description", placeholder: "e.g., React, Next.js..." }] },
        { key: "displayOrder", label: "Display Priority (Lower comes first)", placeholder: "e.g., 1", type: "number" }
      ]}
    />
  );
}
