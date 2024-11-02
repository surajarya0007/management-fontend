
'use client';
import { useState, useEffect } from "react";
import Modal from "react-modal";
import Layout from "@/components/Layout";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import router from "next/router";

const UserManagement = () => {
  const roles = ["Admin", "Security Analyst", "Developer"];
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", fullName: "", email: "", password: "", role: "" });
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers(searchTerm, roleFilter, statusFilter);
  }, [users, searchTerm, roleFilter, statusFilter]);



  const fetchUsers = async () => {
    try {
      if(userRole == "admin"){
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data =  await response.json();
      console.log(data);
      setUsers(data);
      }
      else{
        alert("Unauthorized Access");
        window.location.href = "/Dashboard";
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };



  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleRoleFilter = (e) => setRoleFilter(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);

  const filterUsers = (search, role, status) => {
    let result = users;
    if (search) result = result.filter(user => user.username.includes(search) || user.email.includes(search));
    if (role) result = result.filter(user => user.role === role);
    if (status) result = result.filter(user => user.status === status);
    setFilteredUsers(result);
  };


  const handleAddUser = async () => {
    try {
      const newUserEntry = { ...newUser}
      console.log(newUserEntry);
      const response = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUserEntry),
      });
  
      if (response.ok) {
        const addedUser = await response.json();
        console.log(addedUser);
        setUsers((prevUserList) => [...prevUserList, addedUser]); // Ensure you access `addedUser.user`
        setNewUser({ username: "", fullName: "", email: "", password: "", role: "" });
        alert("User added successfully");
      } else {
        console.error("Failed to add User");
        alert("Failed to add User. Please try again.");
      }
      closeModal('add');
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  

  const handleEditUser = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${editUser._id}`, editUser, {
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
    try {
      await axios.delete(`http://localhost:5000/api/users/${deleteUser._id}`, {
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
  

  const openEditModal = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const closeModal = (type) => {
    if (type === 'add') setIsAddModalOpen(false);
    if (type === 'edit') setIsEditModalOpen(false);
    if (type === 'delete') setIsDeleteModalOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">User Management</h2>

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
                  <button onClick={() => openEditModal(user)} className="text-blue-600">Edit</button>
                  <button onClick={() => { setDeleteUser(user); setIsDeleteModalOpen(true); }} className="text-red-600 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal isOpen={isAddModalOpen} onRequestClose={() => closeModal('add')} ariaHideApp={false}>
          <h2 className="text-2xl font-bold mb-4">Add New User</h2>
          <form>
            <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} className="border rounded p-2 w-full mb-2" required />
            <input type="text" placeholder="Full Name" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} className="border rounded p-2 w-full mb-2" required />
            <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="border rounded p-2 w-full mb-2" required />
            <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="border rounded p-2 w-full mb-2" required />
            <select onChange={e => setNewUser({ ...newUser, role: e.target.value })} value={newUser.role} className="border rounded p-2 w-full mb-2" required>
              <option value="">Select Role</option>
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <button type="button" onClick={handleAddUser} className="bg-blue-500 text-white rounded px-4 py-2">Add User</button>
            <button type="button" onClick={() => closeModal('add')} className="bg-gray-500 text-white rounded px-4 py-2 ml-2">Cancel</button>
          </form>
        </Modal>

        <Modal isOpen={isEditModalOpen} onRequestClose={() => closeModal('edit')} ariaHideApp={false}>
          <h2 className="text-2xl font-bold mb-4">Edit User</h2>
          {editUser && (
            <form>
              <input type="text" placeholder="Username" value={editUser.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} className="border rounded p-2 w-full mb-2" required />
              <input type="text" placeholder="Full Name" value={editUser.fullName} onChange={e => setEditUser({ ...editUser, fullName: e.target.value })} className="border rounded p-2 w-full mb-2" required />
              <input type="email" placeholder="Email" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} className="border rounded p-2 w-full mb-2" required />
              <select onChange={e => setEditUser({ ...editUser, role: e.target.value })} value={editUser.role} className="border rounded p-2 w-full mb-2" required>
                <option value="">Select Role</option>
                {roles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
              <select onChange={e => setEditUser({ ...editUser, status: e.target.value })} value={editUser.status} className="border rounded p-2 w-full mb-2" required>
                <option value="">Select Status</option>
                {statuses.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
              <button type="button" onClick={handleEditUser} className="bg-blue-500 text-white rounded px-4 py-2">Save Changes</button>
              <button type="button" onClick={() => closeModal('edit')} className="bg-gray-500 text-white rounded px-4 py-2 ml-2">Cancel</button>
            </form>
          )}
        </Modal>

        <Modal isOpen={isDeleteModalOpen} onRequestClose={() => closeModal('delete')} ariaHideApp={false}>
          <h2 className="text-2xl font-bold mb-4">Confirm Delete</h2>
          {deleteUser && (
            <div>
              <p>Are you sure you want to delete {deleteUser.username}?</p>
              <button type="button" onClick={handleDeleteUser} className="bg-red-500 text-white rounded px-4 py-2 mt-2">Delete</button>
              <button type="button" onClick={() => closeModal('delete')} className="bg-gray-500 text-white rounded px-4 py-2 ml-2 mt-2">Cancel</button>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default UserManagement;
