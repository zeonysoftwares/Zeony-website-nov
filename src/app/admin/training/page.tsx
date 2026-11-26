"use client";

import React from "react";
import AdminSectionManager from "@/components/admin/AdminSectionManager";

export default function TrainingAdminPage() {
  return (
    <AdminSectionManager
      sectionKey="training"
      title="Training & Certifications"
      subtitle="Add, edit, and delete academy training initiatives, certification programs, and workshops."
      fields={[
        { key: "title", label: "Program Title", placeholder: "e.g., Industry-Oriented Training & Certification...", required: true, type: "text" },
        { key: "img", label: "Program Image URL", placeholder: "/img/culture_workshop.png...", required: true, type: "text" },
        { key: "desc", label: "Program Description", placeholder: "Workshops, seminars, and skill development programs...", type: "textarea" }
      ]}
    />
  );
}
