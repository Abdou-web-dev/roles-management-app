import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import dashboard from "../../assets/dashboard.svg";
import locks from "../../assets/locks.svg";
import settings from "../../assets/settings.svg";
import integrations from "../../assets/integrations.svg";
import reports from "../../assets/reports.svg";
import team from "../../assets/team.svg";
import automations from "../../assets/automations.svg";
import facilities from "../../assets/facilities.svg";
import manna_tech from "../../assets/manna_tech.svg";

import "./nav_styles.scss";
import { useState } from "react";

export const LateralNavBar = () => {
  const tabs = [
    { name: "Dashboard", path: "/dashboard", icon: dashboard },
    { name: "Locks", path: "/locks", icon: locks },
    { name: "Team", path: "/team", icon: team },
    { name: "Facilities", path: "/facilities", icon: facilities },
    { name: "Automations", path: "/automations", icon: automations },
    { name: "Reports", path: "/reports", icon: reports },
    { name: "Integrations", path: "/integrations", icon: integrations },
    { name: "Settings", path: "/settings", icon: settings },
  ];
  const [activeTab, setActiveTab] = useState("/dashboard"); // default active tab

  return (
    <div className="lateral__nav">
      <Sidebar
        rootStyles={{
          backgroundColor: "#33C173",
        }}
        className="sidebar"
      >
        <Menu
          className="ps-sidebar-container__custom"
          menuItemStyles={{
            button: {
              // the active class will be added automatically by react router
              // so we can use it to style the active menu item
              [`&.active`]: {
                backgroundColor: "#13395e",
                color: "#b6c8d9",
              },
            },
          }}
        >
          <Link
            to={`/`}
            className="manna_tech_logo"
            onClick={() => setActiveTab("/dashboard")}
          >
            <img
              src={manna_tech}
              alt=""
            />
          </Link>
          <div className="items-wrapper">
            {tabs.map((tab) => (
              <MenuItem
                key={tab.name}
                component={<Link to={tab.path} />}
                active={activeTab === tab.path}
                className={`menu__item ${activeTab === tab.path ? "active" : ""}`}
                onClick={() => setActiveTab(tab.path)}
                // className="menu__item"
              >
                <img
                  src={tab.icon}
                  alt=""
                />
              </MenuItem>
            ))}
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
};
