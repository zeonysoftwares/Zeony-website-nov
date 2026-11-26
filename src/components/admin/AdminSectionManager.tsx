"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, RefreshCw, CheckCircle2, AlertCircle, X, Upload, Loader2, Edit } from "lucide-react";
import { AdminItem, useAdminStore, AdminSectionKey } from "@/lib/adminStore";
import { supabase } from "@/lib/supabase";
import { logAdminActivity } from "@/lib/activityStore";

type FieldValue =
  | string
  | number
  | string[]
  | Record<string, string>[]
  | { name: string; detail: string }[]
  | { name: string; value: string }[]
  | undefined;

interface AdminSectionManagerProps {
  sectionKey: AdminSectionKey;
  title: string;
  subtitle: string;
  fields?: {
    key: keyof Omit<AdminItem, "id">;
    label: string;
    placeholder: string;
    required?: boolean;
    type?: "text" | "textarea" | "select" | "string-array" | "object-array" | "number";
    options?: string[];
    subFields?: { key: string; label: string; placeholder: string }[];
  }[];
}

export default function AdminSectionManager({ sectionKey, title, subtitle, fields }: AdminSectionManagerProps) {
  const { items, isLoaded, addItem, deleteItem, updateItem, resetToDefault } = useAdminStore(sectionKey);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, FieldValue>>({});
  const [deleteIdConfirm, setDeleteIdConfirm] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const defaultFields: NonNullable<AdminSectionManagerProps["fields"]> = fields || [
    { key: "title", label: "Title / Name", placeholder: "Enter item title...", required: true, type: "text" },
    { key: "subtitle", label: "Subtitle / Category", placeholder: "Enter category or subtitle...", type: "text" },
    { key: "img", label: "Image / Logo URL", placeholder: "/img/sample.png or upload below...", required: true, type: "text" },
    { key: "desc", label: "Description / Details", placeholder: "Enter details...", type: "textarea" }
  ];

  const handleOpenModal = () => {
    const initial: Record<string, FieldValue> = {};
    defaultFields.forEach((f) => {
      initial[f.key] = (f.type === "string-array" || f.type === "object-array") ? [] : "";
    });
    setFormData(initial);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEditOpenModal = (item: AdminItem) => {
    const initial: Record<string, FieldValue> = {};
    defaultFields.forEach((f) => {
      const value = item[f.key];
      initial[f.key] = value !== undefined ? value : ((f.type === "string-array" || f.type === "object-array") ? [] : "");
    });
    setFormData(initial);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // 1. Immediately read as local Data URL for guaranteed preview and offline support
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setFormData((prev) => ({ ...prev, img: dataUrl }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // 2. Attempt Supabase storage upload if available
      const fileExt = file.name.split('.').pop() || "png";
      const fileName = `admin/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const { data: uploadData, error } = await supabase.storage
        .from("storage_images")
        .upload(fileName, file);

      if (uploadData && !error) {
        const { data: publicUrlData } = supabase.storage
          .from("storage_images")
          .getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) {
          setFormData((prev) => ({ ...prev, img: publicUrlData.publicUrl }));
        }
      }
    } catch (e) {
      console.warn("Storage upload warning, using local preview image instead:", e);
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const imgField = defaultFields.find((f) => f.key === "img");
    const defaultImgFallback = imgField?.required ? "/img/web-dev.jpg" : "";
    const itemData: Record<string, FieldValue> = {
      title: String(formData.title || "New Item"),
      subtitle: String(formData.subtitle || formData.category || ""),
      category: String(formData.category || formData.subtitle || ""),
      img: formData.img ? String(formData.img) : defaultImgFallback,
      desc: String(formData.desc || "")
    };
    defaultFields.forEach((f) => {
      if (!["title", "subtitle", "category", "img", "desc"].includes(f.key)) {
        itemData[f.key] = formData[f.key];
      }
    });

    if (editingId) {
      updateItem(editingId, itemData as Partial<AdminItem>);
      logAdminActivity("Updated Content Item", "content", `Updated item "${itemData.title}" in ${title}`);
    } else {
      addItem(itemData as Omit<AdminItem, "id">);
      logAdminActivity("Added Content Item", "content", `Added item "${itemData.title}" to ${title}`);
    }
    setIsModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm font-medium"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Item successfully {editingId ? "updated in" : "added to"} {title}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">{title}</h1>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={resetToDefault}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors flex items-center gap-2 border border-slate-700"
            title="Restore original items"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Grid Display of Items */}
      {items.length === 0 ? (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto my-12">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No items in this section</h3>
          <p className="text-sm text-slate-400 mb-6">You have removed all items from {title}. Add a new item or restore default items.</p>
          <button
            onClick={resetToDefault}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Restore Default Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f172a] border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-2xl flex flex-col justify-between group"
            >
              <div>
                {item.img ? (
                  <div className="relative h-44 w-full bg-slate-900/60 p-6 flex items-center justify-center border-b border-slate-800/60 overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                ) : item.icon ? (
                  <div className="px-6 pt-6 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-heading font-bold text-base flex items-center justify-center shadow-lg shadow-blue-600/20">
                      {item.icon}
                    </div>
                  </div>
                ) : null}
                <div className="p-6">
                  {(item.subtitle || item.category) && (
                    <span className="inline-block px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-2 border border-blue-500/20">
                      {item.subtitle || item.category}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.title}</h3>
                  {item.desc && (
                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{item.desc}</p>
                  )}
                </div>
              </div>

              {/* Card Footer / Action */}
              <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">ID: {item.id}</span>

                {deleteIdConfirm === item.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        deleteItem(item.id);
                        logAdminActivity("Deleted Content Item", "content", `Deleted item "${item.title}" from ${title}`);
                        setDeleteIdConfirm(null);
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-colors shadow-md"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteIdConfirm(null)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditOpenModal(item)}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 text-xs font-semibold transition-all flex items-center gap-1.5 border border-blue-500/20 hover:border-blue-500/40"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteIdConfirm(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold transition-all flex items-center gap-1.5 border border-red-500/20 hover:border-red-500/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90dvh] flex flex-col overflow-hidden shadow-2xl relative"
            >
              <div className="shrink-0 px-6 pt-6 pb-4 border-b border-slate-800/80 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-bold text-white">
                    {editingId ? "Edit Item" : "Add New Item"}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {editingId ? "Update the details below." : `Create a new entry for ${title}.`}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col">
                <div
                  data-lenis-prevent
                  className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar p-6 space-y-4"
                >
                  {defaultFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>

                    {field.key === "img" ? (
                      <div className="space-y-3">
                        {/* Option 1: URL input */}
                        <input
                          type="text"
                          required={field.required && !formData.img}
                          placeholder={field.placeholder}
                          value={String(formData[field.key] || "")}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder:text-slate-600"
                        />

                        {/* Option 2: File Upload Button */}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            id="admin-image-upload"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleImageFileUpload(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="admin-image-upload"
                            className="w-full px-4 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-blue-500 cursor-pointer flex items-center justify-center gap-2 text-sm text-slate-300 transition-colors"
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                                <span>Uploading image...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 text-blue-400" />
                                <span>Or Upload Image from Computer</span>
                              </>
                            )}
                          </label>
                        </div>

                        {/* Thumbnail Preview */}
                        {formData.img && (
                          <div className="mt-2 p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-800/80 overflow-hidden relative shrink-0 flex items-center justify-center">
                              <Image src={String(formData.img)} alt="Preview" fill sizes="48px" unoptimized className="object-contain" />
                            </div>
                            <div className="overflow-hidden flex-1">
                              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Image Ready
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">{String(formData.img)}</p>
                            </div>
                            {!field.required && (
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, [field.key]: "" })}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors shrink-0"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : field.type === "select" && field.options ? (
                      <select
                        required={field.required}
                        value={String(formData[field.key] || "")}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-white"
                      >
                        <option value="" disabled>
                          {field.placeholder || `Select ${field.label}`}
                        </option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt} className="bg-slate-900 text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={String(formData[field.key] || "")}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder:text-slate-600"
                      />
                    ) : field.type === "string-array" ? (
                      <div className="space-y-2">
                        {Array.isArray(formData[field.key]) && (formData[field.key] as string[]).map((val: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => {
                                const newArr = [...(formData[field.key] as string[])];
                                newArr[idx] = e.target.value;
                                setFormData({ ...formData, [field.key]: newArr });
                              }}
                              className="w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newArr = (formData[field.key] as string[]).filter((_, i) => i !== idx);
                                setFormData({ ...formData, [field.key]: newArr });
                              }}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newArr = Array.isArray(formData[field.key]) ? [...(formData[field.key] as string[]), ""] : [""];
                            setFormData({ ...formData, [field.key]: newArr });
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Item
                        </button>
                      </div>
                    ) : field.type === "object-array" && field.subFields ? (
                      <div className="space-y-3">
                        {Array.isArray(formData[field.key]) && (formData[field.key] as Record<string, string>[]).map((val, idx: number) => (
                          <div key={idx} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => {
                                const newArr = (formData[field.key] as Record<string, string>[]).filter((_, i) => i !== idx);
                                setFormData({ ...formData, [field.key]: newArr });
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            {field.subFields!.map(sub => (
                              <div key={sub.key}>
                                <label className="block text-[10px] text-slate-400 uppercase mb-1">{sub.label}</label>
                                <input
                                  type="text"
                                  placeholder={sub.placeholder}
                                  value={val[sub.key] || ""}
                                  onChange={(e) => {
                                    const newArr = [...(formData[field.key] as Record<string, string>[])];
                                    newArr[idx] = { ...newArr[idx], [sub.key]: e.target.value };
                                    setFormData({ ...formData, [field.key]: newArr });
                                  }}
                                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-white"
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newObj: Record<string, string> = {};
                            field.subFields!.forEach(sub => newObj[sub.key] = "");
                            const newArr = Array.isArray(formData[field.key]) ? [...(formData[field.key] as Record<string, string>[]), newObj] : [newObj];
                            setFormData({ ...formData, [field.key]: newArr });
                          }}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add {field.label} Item
                        </button>
                      </div>
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={String(formData[field.key] ?? "")}
                        onChange={(e) => setFormData({ ...formData, [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder:text-slate-600"
                      />
                    )}
                  </div>
                ))}
                </div>

                <div className="shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/80 bg-[#0f172a]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                  >
                    {editingId ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingId ? "Save Changes" : "Save & Add Item"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
