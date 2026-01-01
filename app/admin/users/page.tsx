"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAllProfiles, updateProfileVerification } from "@/lib/admin";
import type { Profile } from "@/lib/types";

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadProfiles = async () => {
    setLoading(true);
    const { data, count } = await getAllProfiles(page, 20, search);
    if (data) {
      let filtered = data;
      if (roleFilter) {
        filtered = data.filter((p: Profile) => p.role === roleFilter);
      }
      setProfiles(filtered);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfiles();
  }, [page, search, roleFilter]);

  const handleVerify = async (profileId: string, isVerified: boolean) => {
    const { error } = await updateProfileVerification(profileId, isVerified);
    if (!error) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId ? { ...p, is_verified: isVerified } : p
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Users</h1>
          <p className="text-gray-600">Manage user profiles and verifications</p>
        </div>
      </div>

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
            <option value="tiler">Tilers</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">User</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
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
                          profile.role === "tiler"
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
                      {profile.role === "tiler" && (
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
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {profile.role === "tiler" && (
                        <button
                          onClick={() => handleVerify(profile.id, !profile.is_verified)}
                          className={`text-sm font-medium ${
                            profile.is_verified
                              ? "text-gray-600 hover:text-red-600"
                              : "text-primary hover:text-primary-dark"
                          }`}
                        >
                          {profile.is_verified ? "Revoke" : "Verify"}
                        </button>
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
