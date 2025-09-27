import React, { useState, useEffect } from "react";
import Header from "../components/layouts/Header";
import Sidebar from "../components/layouts/Sidebar";
import "../styles/Dashboard.css";

const Dashboard = ({children}) => {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 700);
  const [showModal, setShowModal] = useState(false);
  
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 700) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard d-flex flex-column" style={{ height: '100vh' }}>
      <Header toggleSidebar={toggleSidebar} />
      <div className="dashboard-content d-flex flex-row flex-grow-1">
        <Sidebar showSidebar={showSidebar} />
        <main className={`dashboard-main ${showModal ? 'modal-open' : ''} flex-grow-1`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

