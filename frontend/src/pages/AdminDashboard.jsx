import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";


const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    const load = async () => {
        try {
           const res = await axios.get("http://locolhost:8080/api/user/all");
           setUsers(res.data);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {load();}, []);

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


}

export default Admin;