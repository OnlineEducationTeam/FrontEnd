import React from "react";
import { GoMail } from "react-icons/go";
import "./homepage.css";
import { Link } from "react-router-dom";
import axios from "axios";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
    };
  }
  componentDidMount() {
    axios
      .get("http://localhost:5000/users/whichuser/session", {
        params: { userId: this.props.profile },
      })
      .then((res) => {
        localStorage.setItem("profileUser", JSON.stringify(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <nav>
        <h2 className="logo">OnliEdu</h2>
        <span className="logoutButtonPosition">
          <button onClick={this.props.logout} className="logoutButtonSytle">
            Logout
          </button>
        </span>
        <Link
          to={{
            pathname: "/OnliEdu/studentProfile",
            params: JSON.parse(localStorage.getItem("profileUser")),
          }}
        >
          <p className="logo" style={{ color: "black" }}>
            My profile
          </p>
        </Link>
      </nav>
    );
  }
}

export default NavBar;
