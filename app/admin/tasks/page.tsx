"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllTasks, updateTaskStatus, deleteTask } from "@/lib/admin";

type TaskWithOwner = {
  id: string;
  title: string;
  description: string;
  location_text: string | null;
  budget_min: number | null;
  budget_max: number | null;
  status: string;
  created_at: string;
  profiles: {
    display_name: string | null;
    full_name: string | null;
  } | null;
};

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<TaskWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");

  const loadTasks = async () => {
    setLoading(true);
    const { data, count } = await getAllTasks(page, 20, statusFilter || undefined);
    if (data) {
      setTasks(data as TaskWithOwner[]);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, [page, statusFilter]);

  const handleStatusChange = async (taskId: string, status: string) => {
    const { error } = await updateTaskStatus(taskId, status);
    if (!error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status } : t))
      );
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) return;
    const { error } = await deleteTask(taskId);
    if (!error) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "awarded":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "-";
    if (min && max) return `Rs. ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `Rs. ${min.toLocaleString()}+`;
    if (max) return `Up to Rs. ${max.toLocaleString()}`;
    return "-";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Tasks</h1>
          <p className="text-gray-600">View and manage posted tasks</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="awarded">Awarded</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Task</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Owner</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Budget</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Created</th>
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
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No tasks found
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-navy line-clamp-1">{task.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{task.location_text || "-"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {task.profiles?.full_name || task.profiles?.display_name || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatBudget(task.budget_min, task.budget_max)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 ${getStatusColor(task.status)}`}
                      >
                        <option value="open">Open</option>
                        <option value="awarded">Awarded</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(task.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/task/${task.id}`}
                          target="_blank"
                          className="text-sm font-medium text-primary hover:text-primary-dark"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {tasks.length > 0 && (
          <div className="p-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {tasks.length} of {totalCount} tasks
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
                disabled={tasks.length < 20}
                className="px-3 py-1 text-sm rounded border hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
