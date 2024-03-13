import React, { useState } from "react";
import { Form, Button, Container, Col } from "react-bootstrap";

function SignUp({ fetchLogin, setLoggedIn, setShowSignUp }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userMail, setUserMail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signInData = {
      userId: userId,
      password: password,
      userName: userName,
      userMail: userMail,
    };
    const response = await fetchLogin(signInData);
    // Check if the response indicates successful login
    if (response && response.error_code === 200) {
      setLoggedIn(true);
    } else {
      console.log("Invalid credentials");
    }
  };

  const handleShowSignUp = () => {
    setShowSignUp(false);
  };

  return (
    <Container>
      <h2>Sign Up</h2>
      <Col xs={4} className="mt-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-1" controlId="formBasicUsername">
            <Form.Control
              type="text"
              placeholder="Enter user Id"
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
          <Form.Group className="mb-1" controlId="formBasicUserName">
            <Form.Control
              type="text"
              placeholder="Enter user name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-1" controlId="formBasicUserMail">
            <Form.Control
              type="text"
              placeholder="Enter user mail"
              value={userMail}
              onChange={(e) => setUserMail(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Sign Up
          </Button>{" "}
          <Button variant="secondary" onClick={handleShowSignUp}>
            Back
          </Button>
        </Form>
      </Col>
    </Container>
  );
}

export default SignUp;
