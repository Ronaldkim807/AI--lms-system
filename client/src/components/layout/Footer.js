import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-1">
          © {new Date().getFullYear()} <strong>AI-LMS</strong>. All rights reserved.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-light">
            <FaGithub size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light">
            <FaLinkedin size={20} />
          </a>
          <a href="mailto:support@ai-lms.com" className="text-light">
            <FaEnvelope size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
