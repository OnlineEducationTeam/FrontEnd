import React from "react";
import "./homepage.css";
import { IoIosHome, IoIosMail } from "react-icons/io";
import { Link } from "react-router-dom";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: ""
    };
  }

  componentDidMount() {
    const userIdC = JSON.parse(localStorage.getItem("profileUser"));
    this.setState({
      token: userIdC._id
    });
  }

  render() {
    return (
      <nav style={{ minHeight: "5vh", overflow: "auto" }}>
        <div style={{ display: "inline" }}>
          <Link
            to={{
              pathname: "/OnliEdu/homepage"
            }}
          >
            <IoIosHome
              size={28}
              style={{ verticalAlign: "inherit", color: "black" }}
            />
          </Link>
          <h2 style={{ display: "inline", top: "10px" }}>OnliEdu</h2>
        </div>

        <div className="navbarIcons">
          <IoIosMail size={32} />
          <br />
        </div>
      </nav>
    );
  }
}

export default NavBar;
