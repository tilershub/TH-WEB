"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  createTaskerProfile,
  deleteProfile,
  getAllProfiles,
  updateProfileApproval,
  updateProfileVerification,
} from "@/lib/admin";
import type { Profile } from "@/lib/types";

const approvalStatusOptions = ["pending", "approved", "declined"] as const;
type ApprovalStatus = (typeof approvalStatusOptions)[number];

const isApprovalStatus = (value: string): value is ApprovalStatus =>
  approvalStatusOptions.includes(value as ApprovalStatus);

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "");
  const [verifiedFilter, setVerifiedFilter] = useState(searchParams.get("verified") || "");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [verificationSupported, setVerificationSupported] = useState(true);
  const [createForm, setCreateForm] = useState<{
    fullName: string;
    email: string;
    password: string;
    displayName: string;
    city: string;
    district: string;
    isVerified: boolean;
    approvalStatus: ApprovalStatus;
    approvalNote: string;
  }>({
    fullName: "",
    email: "",
    password: "",
    displayName: "",
    city: "",
    district: "",
    isVerified: false,
    approvalStatus: "pending",
    approvalNote: "",
  });

  const loadProfiles = async () => {
    setLoading(true);
    const { data, count, verificationSupported: supportsVerification } = await getAllProfiles({
      page,
      limit: 20,
      search,
      role: roleFilter || undefined,
      isVerified: verifiedFilter === "true" ? true : verifiedFilter === "false" ? false : undefined,
    });
    if (data) {
      setProfiles(
        data.map((profile) => ({
          ...profile,
          is_verified: profile.is_verified ?? false,
          approval_status: profile.approval_status ?? "approved",
        }))
      );
      setTotalCount(count || 0);
    }
    setVerificationSupported(supportsVerification ?? true);
    setLoading(false);
  };

  useEffect(() => {
    loadProfiles();
  }, [page, search, roleFilter, verifiedFilter]);

  useEffect(() => {
    setRoleFilter(searchParams.get("role") || "");
    setVerifiedFilter(searchParams.get("verified") || "");
    setPage(1);
  }, [searchParams]);

  const handleVerify = async (profileId: string, isVerified: boolean) => {
    setActionError(null);
    setActionLoadingId(profileId);
    const { error } = await updateProfileVerification(profileId, isVerified);
    if (!error) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId ? { ...p, is_verified: isVerified } : p
        )
      );
    } else {
      setActionError(error);
    }
    setActionLoadingId(null);
  };

  const handleApproval = async (profileId: string, status: ApprovalStatus) => {
    setActionError(null);
    setActionLoadingId(profileId);
    let note: string | undefined;

    if (status === "declined") {
      const response = window.prompt(
        "Add a note for the tasker (shown to the user):",
        "Your tasker profile does not meet the requirements."
      );
      if (response === null) {
        setActionLoadingId(null);
        return;
      }
      note = response.trim() || "Your tasker profile does not meet the requirements.";
    }

    const { error } = await updateProfileApproval(profileId, status, note);
    if (!error) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId
            ? { ...p, approval_status: status, approval_note: status === "declined" ? note : null }
            : p
        )
      );
    } else {
      setActionError(error);
    }
    setActionLoadingId(null);
  };

  const handleDelete = async (profileId: string) => {
    const confirmed = window.confirm("Delete this tasker profile? This action cannot be undone.");
    if (!confirmed) return;
    setActionError(null);
    setActionLoadingId(profileId);
    const { error } = await deleteProfile(profileId);
    if (!error) {
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } else {
      setActionError(error);
    }
    setActionLoadingId(null);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError(null);
    setCreating(true);

    const { error } = await createTaskerProfile({
      fullName: createForm.fullName,
      email: createForm.email,
      password: createForm.password,
      displayName: createForm.displayName || undefined,
      city: createForm.city || undefined,
      district: createForm.district || undefined,
      isVerified: createForm.isVerified,
      approvalStatus: createForm.approvalStatus,
      approvalNote: createForm.approvalNote || undefined,
    });

    if (error) {
      setCreateError(error);
    } else {
      setCreateForm({
        fullName: "",
        email: "",
        password: "",
        displayName: "",
        city: "",
        district: "",
        isVerified: false,
        approvalStatus: "pending",
        approvalNote: "",
      });
      setShowCreateForm(false);
      loadProfiles();
    }

    setCreating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Users</h1>
          <p className="text-gray-600">Manage user profiles and verifications</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark"
        >
          {showCreateForm ? "Close create form" : "Create tasker"}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Full name</label>
              <input
                type="text"
                required
                value={createForm.fullName}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, fullName: event.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Display name</label>
              <input
                type="text"
                value={createForm.displayName}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, displayName: event.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={createForm.email}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Temporary password</label>
              <input
                type="password"
                required
                value={createForm.password}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={createForm.city}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, city: event.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">District</label>
              <input
                type="text"
                value={createForm.district}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, district: event.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Approval status</label>
              <select
                value={createForm.approvalStatus}
                onChange={(event) => {
                  const { value } = event.target;
                  if (isApprovalStatus(value)) {
                    setCreateForm((prev) => ({ ...prev, approvalStatus: value }));
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                {approvalStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {createForm.approvalStatus === "declined" && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Decline note</label>
              <input
                type="text"
                value={createForm.approvalNote}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, approvalNote: event.target.value }))}
                placeholder="Tasker profile does not meet requirements."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={createForm.isVerified}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, isVerified: event.target.checked }))}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            Mark as verified
          </label>
          {createError && <p className="text-sm text-red-600">{createError}</p>}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create tasker"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="">All Roles</option>
            <option value="homeowner">Homeowners</option>
            <option value="tasker">Taskers</option>
          </select>
        </div>
        {(actionError || !verificationSupported) && (
          <div
            className={`px-4 py-3 text-sm border-b ${
              actionError
                ? "text-red-600 border-red-100 bg-red-50"
                : "text-amber-700 border-amber-100 bg-amber-50"
            }`}
          >
            {actionError ||
              "Verification is unavailable because the profiles table is missing the is_verified column. Apply the database migration and refresh the schema cache."}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">User</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Approval</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Joined</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                          {(profile.full_name || profile.display_name || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-navy">
                            {profile.full_name || profile.display_name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">{profile.email || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          profile.role === "tasker"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {profile.city && profile.district
                        ? `${profile.city}, ${profile.district}`
                        : profile.district || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {profile.role === "tasker" ? (
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              profile.approval_status === "approved"
                                ? "bg-green-100 text-green-800"
                                : profile.approval_status === "declined"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {profile.approval_status === "approved"
                              ? "Approved"
                              : profile.approval_status === "declined"
                                ? "Declined"
                                : "Pending"}
                          </span>
                          {profile.approval_status === "declined" && profile.approval_note && (
                            <div className="text-xs text-red-600 line-clamp-2">{profile.approval_note}</div>
                          )}
                          {verificationSupported && (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                profile.is_verified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {profile.is_verified ? (
                                <>
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Verified
                                </>
                              ) : (
                                "Unverified"
                              )}
                            </span>
                          )}
                          {!verificationSupported && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              Verification unavailable
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {profile.role === "tasker" ? (
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleApproval(profile.id, "approved")}
                              disabled={actionLoadingId === profile.id}
                              className="text-sm font-medium text-green-700 hover:text-green-800 disabled:opacity-60"
                            >
                              {actionLoadingId === profile.id ? "Updating..." : "Approve"}
                            </button>
                            <button
                              onClick={() => handleApproval(profile.id, "declined")}
                              disabled={actionLoadingId === profile.id}
                              className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
                            >
                              {actionLoadingId === profile.id ? "Updating..." : "Decline"}
                            </button>
                          </div>
                          <button
                            onClick={() => handleVerify(profile.id, !profile.is_verified)}
                            disabled={actionLoadingId === profile.id || !verificationSupported}
                            className={`text-sm font-medium ${
                              profile.is_verified
                                ? "text-gray-600 hover:text-red-600"
                                : "text-primary hover:text-primary-dark"
                            } ${!verificationSupported ? "opacity-60 cursor-not-allowed" : ""}`}
                          >
                            {!verificationSupported
                              ? "Verify (unavailable)"
                              : actionLoadingId === profile.id
                                ? "Updating..."
                                : profile.is_verified
                                  ? "Revoke"
                                  : "Verify"}
                          </button>
                          <button
                            onClick={() => handleDelete(profile.id)}
                            disabled={actionLoadingId === profile.id}
                            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
                          >
                            {actionLoadingId === profile.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {profiles.length} of {totalCount} users
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={profiles.length < 20}
              className="px-3 py-1 text-sm rounded border hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
