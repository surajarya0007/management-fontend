"use client";
import { useState, useEffect, SetStateAction } from "react";
import Layout from "@/components/Layout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import {
  springSnappy,
  scaleIn,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";
import { API_BASE } from "@/lib/api";

interface User {
  _id?: string;
  username: string;
  fullName: string;
  email: string;
  password?: string;
  role: string;
  status?: string;
}

interface DecodedToken {
  role: string;
}

const card = {
  background: "#0f1314",
  border: "1px solid #1f2e2d",
  borderRadius: "12px",
};
const inputStyle: React.CSSProperties = {
  background: "#0a0d0d",
  border: "1px solid #1f2e2d",
  color: "#f0fdfa",
  borderRadius: "8px",
  padding: "10px 12px",
  fontSize: "13px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.15s",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "#14b8a6";
};
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.borderColor = "#1f2e2d";
};

const roleBadgeStyle = (role: string): React.CSSProperties => {
  switch (role.toLowerCase()) {
    case "admin":
      return {
        background: "rgba(52,211,153,0.1)",
        color: "#34d399",
        border: "1px solid rgba(52,211,153,0.2)",
      };
    case "security analyst":
      return {
        background: "rgba(13,148,136,0.1)",
        color: "#5eead4",
        border: "1px solid rgba(13,148,136,0.2)",
      };
    case "developer":
      return {
        background: "rgba(52,211,153,0.1)",
        color: "#34d399",
        border: "1px solid rgba(52,211,153,0.2)",
      };
    default:
      return {
        background: "rgba(13,148,136,0.08)",
        color: "#2dd4bf",
        border: "1px solid rgba(13,148,136,0.15)",
      };
  }
};

const avatarGradients = [
  "linear-gradient(135deg,#0d9488,#14b8a6)",
  "linear-gradient(135deg,#047857,#0d9488)",
  "linear-gradient(135deg,#0e7490,#2dd4bf)",
  "linear-gradient(135deg,#115e59,#34d399)",
];

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "rgba(5,7,8,0.82)",
            backdropFilter: "blur(6px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="relative w-full max-w-md mx-4 z-10 rounded-xl overflow-hidden"
          style={{
            background: "#0f1314",
            border: "1px solid #1f2e2d",
            boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
          }}
          variants={scaleIn}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #1f2e2d" }}
          >
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="transition-colors"
              style={{ color: "#0d9488" }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>
          <motion.div
            className="p-5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, ...springSnappy }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "",
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [userRole, setUserRole] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([
    "Admin", "Security Analyst", "Developer", "Analyst", "Tester", "Engineer",
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/roles`)
      .then((r) => r.json())
      .then((d: { roles?: string[] }) => {
        if (d.roles?.length) setRoles(d.roles);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (userRole) fetchUsers();
  }, [userRole]);

  useEffect(() => {
    let result = users;
    if (searchTerm)
      result = result.filter(
        (u) => u.username.includes(searchTerm) || u.email.includes(searchTerm),
      );
    if (roleFilter) result = result.filter((u) => u.role === roleFilter);
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      if (userRole === "Admin") {
        const res = await fetch(`${API_BASE}/users`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        const u = await res.json();
        setUsers((p) => [...p, u.user]);
        setNewUser({
          username: "",
          fullName: "",
          email: "",
          password: "",
          role: "",
        });
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditUser = async () => {
    if (!editUser) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `${API_BASE}/users/${editUser._id}`,
        editUser,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUsers(users.map((u) => (u._id === res.data._id ? res.data : u)));
      setEditUser(null);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE}/users/${deleteUser._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== deleteUser._id));
      setDeleteUser(null);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const ModalInputs = ({
    user,
    setUser,
  }: {
    user: User;
    setUser: (u: User) => void;
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: "#2dd4bf" }}
          >
            Username
          </label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="johndoe"
          />
        </div>
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: "#2dd4bf" }}
          >
            Full Name
          </label>
          <input
            type="text"
            value={user.fullName}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder="John Doe"
          />
        </div>
      </div>
      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: "#2dd4bf" }}
        >
          Email
        </label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          style={inputStyle}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="john@example.com"
        />
      </div>
      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: "#2dd4bf" }}
        >
          Role
        </label>
        <select
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          style={{ ...inputStyle, cursor: "pointer" }}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <option value="" style={{ background: "#0a0d0d" }}>
            Select Role
          </option>
          {roles.map((r) => (
            <option key={r} value={r} style={{ background: "#0a0d0d" }}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <Layout>
      <motion.div
        className="max-w-6xl mx-auto space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h2 className="text-lg font-bold text-white">User Management</h2>
            <p className="text-sm mt-0.5" style={{ color: "#0d9488" }}>
              {users.length} users registered
            </p>
          </div>
          <motion.button
            onClick={() => setIsAddModalOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ background: "#0d9488" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#14b8a6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#0d9488";
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Add User
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#0d9488" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, paddingLeft: "40px" }}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setRoleFilter(e.target.value as string)
            }
            style={{
              ...inputStyle,
              width: "auto",
              minWidth: "140px",
              cursor: "pointer",
            }}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <option value="" style={{ background: "#0a0d0d" }}>
              All Roles
            </option>
            {roles.map((r) => (
              <option key={r} value={r} style={{ background: "#0a0d0d" }}>
                {r}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Table */}
        <motion.div
          style={card}
          className="overflow-hidden"
          variants={staggerItem}
          whileHover={{ boxShadow: "0 16px 48px rgba(0,0,0,0.3)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #1f2e2d" }}>
                  {["User", "Email", "Role", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      className={`${i === 3 ? "text-right" : "text-left"} px-5 py-3 text-xs font-semibold uppercase tracking-wider`}
                      style={{ color: "#0d9488" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center text-sm"
                      style={{ color: "#6b9e97" }}
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      style={{
                        borderBottom: "1px solid rgba(31,46,46,0.5)",
                        background: "transparent",
                      }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: Math.min(index * 0.04, 0.4),
                        ...springSnappy,
                      }}
                      whileHover={{ backgroundColor: "rgba(13,148,136,0.07)" }}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                            style={{
                              background:
                                avatarGradients[index % avatarGradients.length],
                            }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {initials(user.fullName || user.username)}
                          </motion.div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {user.fullName || "—"}
                            </p>
                            <p className="text-xs" style={{ color: "#0d9488" }}>
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-5 py-3.5 text-sm"
                        style={{ color: "#5a7d78" }}
                      >
                        {user.email}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex px-2 py-0.5 rounded text-xs font-medium"
                          style={roleBadgeStyle(user.role)}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditUser(user);
                              setIsEditModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-medium rounded transition-colors"
                            style={{ color: "#fbbf24" }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = "rgba(245,158,11,0.08)";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = "transparent";
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-medium rounded transition-colors"
                            style={{ color: "#f87171" }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = "rgba(239,68,68,0.08)";
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLElement
                              ).style.background = "transparent";
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Add Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New User"
        >
          <div className="space-y-4">
            <ModalInputs user={newUser} setUser={setNewUser} />
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#2dd4bf" }}
              >
                Password
              </label>
              <input
                type="password"
                value={newUser.password || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder="••••••••"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddUser}
                className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                style={{ background: "#0d9488" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#14b8a6";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#0d9488";
                }}
              >
                Add User
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 text-sm font-medium py-2.5 rounded-lg transition-colors"
                style={{
                  background: "#0a0d0d",
                  border: "1px solid #1f2e2d",
                  color: "#99f6e4",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(13,148,136,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#0a0d0d";
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit User"
        >
          {editUser && (
            <div className="space-y-4">
              <ModalInputs user={editUser} setUser={setEditUser} />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleEditUser}
                  className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                  style={{ background: "#0d9488" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#14b8a6";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#0d9488";
                  }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 text-sm font-medium py-2.5 rounded-lg transition-colors"
                  style={{
                    background: "#0a0d0d",
                    border: "1px solid #1f2e2d",
                    color: "#99f6e4",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(13,148,136,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#0a0d0d";
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete"
        >
          {deleteUser && (
            <div className="space-y-4">
              <div
                className="flex items-center gap-3 p-4 rounded-lg"
                style={{
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.15)",
                }}
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  style={{ color: "#f87171" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-sm" style={{ color: "#99f6e4" }}>
                  Delete{" "}
                  <span className="font-semibold text-white">
                    {deleteUser.fullName || deleteUser.username}
                  </span>
                  ? This cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                  style={{ background: "#dc2626" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#ef4444";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#dc2626";
                  }}
                >
                  Delete User
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 text-sm font-medium py-2.5 rounded-lg transition-colors"
                  style={{
                    background: "#0a0d0d",
                    border: "1px solid #1f2e2d",
                    color: "#99f6e4",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(13,148,136,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "#0a0d0d";
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Modal>
      </motion.div>
    </Layout>
  );
};

export default UserManagement;
