import React, { useState, useContext } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const Register = () => {

    const { registerInfo, updateRegisterInfo, registerError, registerUser, isRegisterLoading } = useContext(AuthContext)

    return (
        <div className="p-4">
            <h2 className="mb-4">Register</h2>

            {registerError?.error && (
                <Alert variant="danger">
                    {registerError.message}
                </Alert>
            )}

            <Form onSubmit={registerUser}>
                <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        onChange={(e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        onChange={(e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter a password"
                        onChange={(e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {isRegisterLoading ? "Creating your Account" : "Register"}
                </Button>
            </Form>
        </div>
    );
};

export default Register;
