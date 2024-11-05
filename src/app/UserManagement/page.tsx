'use client';
import { useState, useEffect, SetStateAction } from "react";
import Modal from "react-modal";
import Layout from "@/components/Layout";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import Link from "next/link";
import router from "next/router";

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

const UserManagement = () => {
  const roles = ["Admin", "Security Analyst", "Developer"];
  const statuses = ["Active", "Inactive"]; // Define the statuses array here if it is required.

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({ username: "", fullName: "", email: "", password: "", role: "" });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        if (decodedToken.role) {
          fetchUsers();
        } else {
          console.error("User role not found in token.");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      console.warn("Token not found in local storage.");
    }
  }, []);

  useEffect(() => {
    filterUsers(searchTerm, roleFilter, statusFilter);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      if (userRole === "Admin") {
        const response = await fetch("https://management-backend-api.vercel.app/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } else {
        alert("Unauthorized Access");
        router.push("/Dashboard");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => setSearchTerm(e.target.value);
  const handleRoleFilter = (e: { target: { value: SetStateAction<string>; }; }) => setRoleFilter(e.target.value);
  const handleStatusFilter = (e: { target: { value: SetStateAction<string>; }; }) => setStatusFilter(e.target.value);

  const filterUsers = (search: string, role: string, status: string) => {
    let result = users;
    if (search) result = result.filter(user => user.username.includes(search) || user.email.includes(search));
    if (role) result = result.filter(user => user.role === role);
    if (status) result = result.filter(user => user.status === status);
    setFilteredUsers(result);
  };

  const handleAddUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://management-backend-api.vercel.app/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const addedUser = await response.json();
        setUsers((prevUserList) => [...prevUserList, addedUser]);
        setNewUser({ username: "", fullName: "", email: "", password: "", role: "" });
        alert("User added successfully");
        closeModal('add');
      } else {
        console.error("Failed to add user.");
        alert("Failed to add User. Please try again.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = async () => {
    if (!editUser) return;
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(`https://management-backend-api.vercel.app/api/users/${editUser._id}`, editUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.map(user => user._id === response.data._id ? response.data : user));
      setEditUser(null);
      closeModal('edit');
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://management-backend-api.vercel.app/api/users/${deleteUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user._id !== deleteUser._id));
      setDeleteUser(null);
      closeModal('delete');
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const closeModal = (type: 'add' | 'edit' | 'delete') => {
    if (type === 'add') setIsAddModalOpen(false);
    if (type === 'edit') setIsEditModalOpen(false);
    if (type === 'delete') setIsDeleteModalOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">User Management</h2>

        {/* Search and Add User Controls */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search by Username or Email"
            value={searchTerm}
            onChange={handleSearch}
            className="border rounded p-2 w-full"
          />
          <select onChange={handleRoleFilter} value={roleFilter} className="border rounded p-2 ml-2">
            <option value="">All Roles</option>
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 text-white rounded px-4 ml-2">Add User</button>
        </div>

        {/* User Table */}
        <table className="min-w-full border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Username</th>
              <th className="border border-gray-300 p-2">Full Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} className="border border-gray-300">
                <td className="border border-gray-300 p-2">{user.username}</td>
                <td className="border border-gray-300 p-2">{user.fullName}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => openEditModal(user)} className="bg-yellow-400 text-white rounded px-2 mr-2">Edit</button>
                  <button onClick={() => setDeleteUser(user)} className="bg-red-500 text-white rounded px-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modals for Adding, Editing, and Deleting Users */}
        <Modal isOpen={isAddModalOpen} onRequestClose={() => closeModal('add')} /* Modal content for adding user */ />
        <Modal isOpen={isEditModalOpen} onRequestClose={() => closeModal('edit')} /* Modal content for editing user */ />
        <Modal isOpen={isDeleteModalOpen} onRequestClose={() => closeModal('delete')} /* Modal content for deleting user */ />
      </div>
    </Layout>
  );
};

export default UserManagement;
