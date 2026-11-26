"use client";

import AdminSectionManager from "@/components/admin/AdminSectionManager";

export default function FeaturedWorkAdminPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <AdminSectionManager
        sectionKey="case_studies"
        title="Featured Work / Case Studies"
        subtitle="Manage the case studies and featured work shown on the Services page."
        fields={[
          { key: "client", label: "Client Name", placeholder: "e.g., Ramamoorthy Nursery", required: true, type: "text" },
          { key: "category", label: "Category / Industry", placeholder: "e.g., Web Design & E-Commerce", required: true, type: "text" },
          { key: "img", label: "Client Logo (Image URL)", placeholder: "/img/client-logo.png or upload below...", required: true, type: "text" },
          { key: "result", label: "Result / Success Metric", placeholder: "e.g., 200% increase in online inquiries in 3 months.", required: true, type: "text" }
        ]}
      />
    </div>
  );
}
