import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaBrain,
  FaChartBar,
  FaBook,
  FaChartLine,
  FaRobot,
  FaUser,
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaCogs,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { Navbar as RBNavbar, Nav, NavDropdown, Container, Modal, Button } from "react-bootstrap";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowLogoutModal(false);
  };

  const isActiveRoute = (path) =>
    location.pathname === path ? "fw-bold text-warning" : "";

  return (
    <>
      <RBNavbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <RBNavbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
            <FaBrain className="me-2 text-warning" /> AI-LMS
          </RBNavbar.Brand>

          <RBNavbar.Toggle aria-controls="navbar-nav" />
          <RBNavbar.Collapse id="navbar-nav">
            {isAuthenticated ? (
              <>
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/dashboard" className={isActiveRoute("/dashboard")}>
                    <FaChartBar className="me-2" /> Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/courses" className={isActiveRoute("/courses")}>
                    <FaBook className="me-2" /> Courses
                  </Nav.Link>

                  {user?.role === "student" && (
                    <>
                      <Nav.Link as={Link} to="/progress" className={isActiveRoute("/progress")}>
                        <FaChartLine className="me-2" /> Progress
                      </Nav.Link>
                      <Nav.Link as={Link} to="/recommendations" className={isActiveRoute("/recommendations")}>
                        <FaRobot className="me-2" /> Recommendations
                      </Nav.Link>
                    </>
                  )}

                  {user?.role === "instructor" && (
                    <Nav.Link as={Link} to="/my-courses" className={isActiveRoute("/my-courses")}>
                      <FaChalkboardTeacher className="me-2" /> My Courses
                    </Nav.Link>
                  )}
                </Nav>

                <Nav>
                  <NavDropdown
                    title={
                      <span className="d-flex align-items-center text-light">
                        <FaUserCircle className="me-2 text-info" size={20} />
                        {user?.name}
                        <span className="badge bg-secondary ms-2">{user?.role}</span>
                      </span>
                    }
                    align="end"
                  >
                    <NavDropdown.ItemText>
                      <small>Signed in as</small>
                      <br />
                      <strong>{user?.email}</strong>
                    </NavDropdown.ItemText>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/profile">
                      <FaUser className="me-2 text-primary" /> My Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/settings">
                      <FaCogs className="me-2 text-secondary" /> Settings
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      className="text-danger d-flex align-items-center"
                      onClick={() => setShowLogoutModal(true)}
                    >
                      <FaSignOutAlt className="me-2" /> Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            ) : (
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/login" className={isActiveRoute("/login")}>
                  <FaSignInAlt className="me-2" /> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className={isActiveRoute("/register")}>
                  <FaUserPlus className="me-2" /> Register
                </Nav.Link>
              </Nav>
            )}
          </RBNavbar.Collapse>
        </Container>
      </RBNavbar>

      {/* Logout Confirmation Modal */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaSignOutAlt className="me-2 text-danger" /> Confirm Logout
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <FaUserCircle size={50} className="text-warning mb-3" />
          <p>Are you sure you want to log out?</p>
          <p className="text-muted small">
            You’ll need to sign in again to access your account.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Yes, Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navbar;
