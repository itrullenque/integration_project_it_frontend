import React, { useState } from "react";
import { Form, Button, Container, Col } from "react-bootstrap";

function Login({ fetchLogin, setLoggedIn, setShowSignUp }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginDict = {
      userId: userId,
      password: password,
    };
    const response = await fetchLogin(loginDict);
    // Check if the response indicates successful login
    if (response && response.error_code === 200) {
      setLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", userId);
    } else {
      console.log("no info for the user");
    }
  };

  const handleSignUp = async (e) => {
    setShowSignUp(true);
  };

  return (
    <Container>
      <h2>Login</h2>
      <Col xs={4} className="mt-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-1" controlId="formBasicUsername">
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-1" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>{" "}
          <Button variant="secondary" onClick={handleSignUp}>
            Sign Up
          </Button>{" "}
        </Form>
      </Col>
    </Container>
  );
}

export default Login;
