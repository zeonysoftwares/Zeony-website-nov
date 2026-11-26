"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Loader2, Mail, Phone, Calendar, Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";

interface Application {
  id: string;
  program_type: string;
  domain_or_track: string;
  duration: string;
  expected_joining_date: string;
  full_name: string;
  email: string;
  phone: string;
  dob: string;
  residential_address: string;
  institution_name: string;
  degree_and_dept: string;
  current_year: string;
  cgpa_or_percentage: string;
  passport_photo_url: string;
  status: string;
  created_at: string;
}

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("academy_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications.");
      } else {
        setApplications(data || []);
      }
      setIsLoading(false);
    };

    fetchApplications();
  }, []);

  const openStatusModal = (app: Application, status: string) => {
    setSelectedApp(app);
    setNewStatus(status);
    setCustomMessage("");
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;

    setIsModalOpen(false);
    setUpdatingId(selectedApp.id);

    try {
      const response = await fetch("/api/applications/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          status: newStatus,
          message: customMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Application marked as ${newStatus} and email sent!`);
        // Update local state
        setApplications(apps => apps.map(app => app.id === selectedApp.id ? { ...app, status: newStatus } : app));
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status.");
    } finally {
      setUpdatingId(null);
      setSelectedApp(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Academy Applications</h1>
        <p className="text-slate-500 mt-2">Manage submissions for internships, training, and workshops.</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No applications yet</h3>
          <p className="text-slate-500 mt-1">When students apply, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Program & Domain</th>
                  <th className="px-6 py-4">Education</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Applicant Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {app.passport_photo_url ? (
                          <Image src={app.passport_photo_url} alt={app.full_name} width={40} height={40} unoptimized className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {app.full_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{app.full_name}</p>
                          <a href={`mailto:${app.email}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {app.email}
                          </a>
                          <a href={`tel:${app.phone}`} className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> {app.phone}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Program Info */}
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
                        {app.program_type}
                      </span>
                      <p className="font-medium text-slate-800">{app.domain_or_track}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {app.duration}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(app.expected_joining_date).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Education Info */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800 truncate max-w-[200px]" title={app.institution_name}>
                        {app.institution_name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{app.degree_and_dept}</p>
                      <p className="text-xs text-slate-500 font-medium">Year: {app.current_year} • CGPA: {app.cgpa_or_percentage}</p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : ''}
                        ${app.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' : ''}
                        ${app.status === 'pending' || !app.status ? 'bg-amber-100 text-amber-700 border border-amber-200' : ''}
                      `}>
                        {app.status || 'pending'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      {updatingId === app.id ? (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin ml-auto" />
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {app.status !== 'accepted' && (
                            <button 
                              onClick={() => openStatusModal(app, 'accepted')}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-200 hover:border-emerald-500"
                              title="Accept Application"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button 
                              onClick={() => openStatusModal(app, 'rejected')}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-200 hover:border-red-500"
                              title="Reject Application"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && selectedApp && (
        <div
          data-lenis-prevent
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90dvh] overflow-y-auto overscroll-contain shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Mark as {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}?
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              This will update the database and <strong>automatically send an email</strong> to {selectedApp.email} notifying them of this decision.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Custom Message (Optional)
              </label>
              <textarea 
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={newStatus === 'accepted' ? "e.g. Please bring your laptop for the onboarding session on Monday..." : "e.g. While you had a strong profile, we have no available slots..."}
                className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[100px] resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateStatus}
                className={`px-6 py-2 font-bold text-white rounded-lg shadow-sm transition-colors ${
                  newStatus === 'accepted' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Confirm & Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
