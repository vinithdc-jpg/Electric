"use client";

import { useState } from "react";

export default function Register() {

    const [form, setForm] = useState({
        name: "",
        age: "",
        phone_number: "",
        email: "",
        password: ""
    });

    const handleSubmit = async () => {

        await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });
    }

    return (
        <div>
            <input
                placeholder="Name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
                placeholder="Age"
                onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
            <input
                placeholder="Phone number"
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            />
            <input
                placeholder="Email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button onClick={handleSubmit}>
                Register
            </button>
        </div>
    )
}