import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";


const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);


    const load = async () => {
        try {
           const res = await axios.get("http://locolhost:5000/api/user/all");
           setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error.message);
            alert("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {load();}, []);

    const handleDelete = async () => {
       try {
            await axios.delete(`http://locolhost:5000/api/user/delete/${id}`)
            setUsers(prev => prev.filter(user => user._id !== id));
       } catch (error) {
            console.error("Error deleting user:", error.message);
            alert("Failed to delete user");
       }
    }


    if(loading) {
        return(
            <>
                <main className="max-w-5xl mx-auto p-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-blue-600">Loading users...</div>
                    </div>
                </main>
            </>
        )
    }


    return(
     <div className="p-6">
      <h2 className="text-2xl text-blue-700 font-bold mb-4">All Users</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone Number</th>
              <th className="px-4 py-2 border">ID Number</th>
              <th className="px-4 py-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.phoneNumber}</td>
                  <td className="px-4 py-2 border">{user.idNumber}</td>
                  <td className="px-4 py-2 border">{user.role || "User"}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-4 border"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default  AdminDashboard;