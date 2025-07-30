import React, { useContext } from 'react';
import { Container, Nav, Navbar, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Notification from './chats/Notification';

const NavBar = () => {

    const { user, logoutUser } = useContext(AuthContext)

    return (
        <Navbar expand="lg" className="mb-4">
            <Container>

                <Navbar.Brand as={Link} to="/" className='text-white'>ChatApp</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Stack direction="horizontal" gap={3} className="ms-auto align-items-center">

                        {
                            user && (
                                <>
                                    <Notification />
                                    <span className="bg-white text-dark px-2 py-1 rounded">Logged in as <strong>{user?.name}</strong></span>
                                    <Nav.Link onClick={() => logoutUser()} as={Link} to="/login">Logout</Nav.Link>
                                </>
                            )
                        }

                        {
                            !user && (
                                <>
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                </>
                            )
                        }



                    </Stack>
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
};

export default NavBar;
