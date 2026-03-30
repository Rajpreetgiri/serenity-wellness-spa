"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Save, Edit2, Check, Home, Info, Phone } from "lucide-react";
import { useContentStore } from "@/lib/admin-store";
import { ContentBlock } from "@/lib/admin-data";
import { useToast } from "@/components/admin/AdminToast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const PAGE_ICONS: Record<string, React.ElementType> = {
  home: Home,
  about: Info,
  contact: Phone,
};

const PAGE_LABELS: Record<string, string> = {
  home: "Home Page",
  about: "About Page",
  contact: "Contact Page",
};

export default function ContentPage() {
  const { content, updateContent } = useContentStore();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { title: string; body: string }>>({});
  const [activeTab, setActiveTab] = useState("home");

  const pages = ["home", "about", "contact"];
  const pageContent = content.filter((c) => c.page === activeTab);

  const startEdit = (block: ContentBlock) => {
    setEditingId(block.id);
    setDrafts((prev) => ({
      ...prev,
      [block.id]: { title: block.title, body: block.body },
    }));
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    const draft = drafts[id];
    if (draft) {
      updateContent(id, { title: draft.title, body: draft.body });
      toast("Content updated successfully", "success");
    }
    setEditingId(null);
  };

  const inputClass =
    "w-full px-3 py-2.5 text-sm bg-[#F8FBF9] dark:bg-gray-800 border border-[#A8CBB7]/30 rounded-xl focus:outline-none focus:border-[#A8CBB7] font-body text-[#1F2A2E] dark:text-white transition-colors";

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl text-[#1F2A2E] dark:text-white">
          Content Management
        </h1>
        <p className="font-body text-sm text-[#6D8B74] mt-0.5">
          Edit website copy and contact information
        </p>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-2">
        {pages.map((page) => {
          const Icon = PAGE_ICONS[page];
          return (
            <button
              key={page}
              onClick={() => setActiveTab(page)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-body font-medium rounded-xl transition-all duration-150",
                activeTab === page
                  ? "bg-[#6D8B74] text-white"
                  : "bg-white dark:bg-gray-900 border border-[#A8CBB7]/30 text-[#6D8B74] hover:bg-[#A8CBB7]/10"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {PAGE_LABELS[page]}
            </button>
          );
        })}
      </div>

      {/* Content Blocks */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {pageContent.map((block) => {
            const isEditing = editingId === block.id;
            const draft = drafts[block.id];

            return (
              <div
                key={block.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-[#A8CBB7]/30 overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-[#A8CBB7]/20">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#6D8B74]" />
                    <span className="text-xs font-body font-semibold text-[#6D8B74] uppercase tracking-wider">
                      {block.section.charAt(0).toUpperCase() + block.section.slice(1)} Section
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-body text-[#6D8B74]/60">
                      Updated {format(new Date(block.updatedAt), "MMM d, yyyy")}
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={cancelEdit}
                          className="px-2.5 py-1 text-xs font-body text-[#6D8B74] border border-[#A8CBB7]/40 rounded-lg hover:bg-[#A8CBB7]/10 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(block.id)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-body font-medium bg-[#6D8B74] text-white rounded-lg hover:bg-[#5a7561] transition-colors"
                        >
                          <Save className="w-3 h-3" />
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(block)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-body text-[#6D8B74] border border-[#A8CBB7]/40 rounded-lg hover:bg-[#A8CBB7]/10 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-[11px] font-body font-medium text-[#6D8B74] uppercase tracking-wider mb-1.5">
                      Heading / Title
                    </label>
                    {isEditing ? (
                      <input
                        value={draft?.title ?? block.title}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [block.id]: { ...prev[block.id], title: e.target.value },
                          }))
                        }
                        className={inputClass}
                      />
                    ) : (
                      <p className="font-heading text-lg text-[#1F2A2E] dark:text-white">
                        {block.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] font-body font-medium text-[#6D8B74] uppercase tracking-wider mb-1.5">
                      Body Content
                    </label>
                    {isEditing ? (
                      <textarea
                        value={draft?.body ?? block.body}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [block.id]: { ...prev[block.id], body: e.target.value },
                          }))
                        }
                        rows={4}
                        className={cn(inputClass, "resize-y")}
                      />
                    ) : (
                      <p className="text-sm font-body text-[#1F2A2E] dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {block.body}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Save All hint */}
      <div className="flex items-center gap-2 text-xs font-body text-[#6D8B74] bg-[#A8CBB7]/10 px-4 py-3 rounded-xl border border-[#A8CBB7]/20">
        <Check className="w-3.5 h-3.5" />
        Changes are saved individually per section. Click Edit then Save on each block.
      </div>
    </div>
  );
}
