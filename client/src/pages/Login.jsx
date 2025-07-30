import React, { useContext, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const Login = () => {

    const { loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading } = useContext(AuthContext)


    return (
        <div className="p-4">
            <h2 className="mb-4">Login</h2>

            {loginError?.error && (
                <Alert variant="danger">
                    {loginError?.message}
                </Alert>
            )}

            <Form onSubmit={loginUser}>
                <Form.Group controlId="loginEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        onChange={(e) => updateLoginInfo({ ...loginInfo, email: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="loginPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => updateLoginInfo({ ...loginInfo, password: e.target.value })}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {
                        isLoginLoading ? "Logging In" : "Login"
                    }
                </Button>
            </Form>
        </div>
    );
};

export default Login;
