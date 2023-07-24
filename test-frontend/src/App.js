import React, { useState } from 'react';

function App() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const addUser = async () => {
        const response = await fetch("http://172.16.3.142:3000/users/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            // If the response status is 200-299, it indicates success.
            const data = await response.text();
            setMessage(data); // Update the message state with the text response
        } else {
            // If the response status is not in the range 200-299, it indicates an error.
            setMessage("Error: Failed to add user."); // Set a custom error message
        }
    };

    return (
        <div className="App">
            <h1>Add User</h1>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button onClick={addUser}>Add User</button>
            </div>
            <p>{message}</p>
        </div>
    );
}

export default App;
