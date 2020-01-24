import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./DashboardPage.scss";
import Dashboard from "../../components/dashboard/Dashboard";

class DashboardPage extends Component {
  render() {
    return (
      <div>
        <nav className="navbar">
          <i className="icon icon-mountains main-logo" />
          <i className="icon icon-user icon-32" />
        </nav>
        <main>
          <div className="main">
            <aside className="sidebar">
              <ul className="sidebar__list">
                <div>
                  <li className="sidebar__list__item">
                    <NavLink
                      to={"/dashboard"}
                      className="sidebar__list__item__link"
                    >
                      News
                    </NavLink>
                  </li>
                  <li className="sidebar__list__item">
                    <NavLink
                      to={"/events"}
                      className="sidebar__list__item__link"
                    >
                      Events
                    </NavLink>
                  </li>
                </div>
                <li className="sidebar__list__item">
                  <NavLink
                    to={"/profile"}
                    className="sidebar__list__item__link"
                  >
                    Profile
                  </NavLink>
                </li>
              </ul>
            </aside>
            <div className="main__content">{this.props.children}</div>
          </div>
        </main>
        <Dashboard />
      </div>
    );
  }
}

export default DashboardPage;
