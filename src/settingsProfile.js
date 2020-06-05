import React from "react";
import NavBar from "./homepagecomp/navbarProfile";
import axios from "axios";
import "./profiles.css";
import Footer from "./homepagecomp/footer";

/*
Η κλάση αυτή καλείται όταν ο χρήστης επιθυμεί να επεξεργαστεί το προφίλ του.
Προφαώς, δημιουργεί αντικείμενο Navbar

*/

class SetingsOfProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      firstName: "",
      lastName: "",
      email: "",
      aboutSelf: "",
      professor: false,
      selectedFile: null,
    };
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem("profileUser"));
    await this.setState({
      token: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      aboutSelf: user.aboutSelf,
      professor: user.professor,
    });
  }

  handleChange = (event) => {
    this.setState({ aboutSelf: event.target.value });
  };

  handleChangeName = (event) => {
    this.setState({ firstName: event.target.value });
  };
  handleChangeSurname = (event) => {
    this.setState({ lastName: event.target.value });
  };

  handleChangeEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  handleSubmit = (event) => {
    localStorage.removeItem("profileUser");
    localStorage.setItem("profileUser", JSON.stringify(this.state));
    this.save();
    event.preventDefault();
  };

  onChangeHandler = (event) => {
    this.setState(
      {
        selectedFile: event.target.files[0],
        loaded: 0,
      },
      () => {
        console.log(this.state.selectedFile);
      }
    );
  };

  async save(props) {
    const user = JSON.parse(localStorage.getItem("profileUser"));
    await axios
      .post("http://localhost:5000/users/updateUser/id", null, {
        params: {
          id: JSON.parse(localStorage.getItem("currentUser")),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          aboutSelf: user.aboutSelf,
        },
      })
      .then((res) => console.log(res.data));

    const data = new FormData();
    data.append("file", this.state.selectedFile);
    await axios
      .post("http://localhost:5000/upload", data, {
        params: { id: JSON.parse(localStorage.getItem("currentUser")) },
      })
      .then((res) => {
        // then print response status
        console.log(res.data);
      });
    this.props.history.push({
      pathname: "/OnliEdu/studentProfile",
    });
  }

  Prof = (props) => {
    if (this.state.professor) {
      return (
        <div className="row">
          <div className="col-md sector">
            Notes
            <br />
            <br />
            <input type="file" name="file" onChange={this.onChangeHandler} />
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <div>
        <NavBar
          profile={this.state.token}
          style={{ marginRight: "5%", marginLeft: "5%" }}
        />
        <div className="container">
          <div className="sectionStyle">
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-md-6 img">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvzOpl3-kqfNbPcA_u_qEZcSuvu5Je4Ce_FkTMMjxhB-J1wWin-Q"
                    alt=""
                    className="img-rounded"
                  />
                </div>
                <div className="col-md-6 details">
                  <blockquote>
                    <textarea
                      value={this.state.firstName}
                      onChange={this.handleChangeName}
                      className="textarea1"
                    ></textarea>
                    <br />
                    <textarea
                      value={this.state.lastName}
                      onChange={this.handleChangeSurname}
                      className="textarea1"
                    ></textarea>
                    <small></small>
                  </blockquote>
                  <textarea
                    value={this.state.email}
                    onChange={this.handleChangeEmail}
                    className="textarea1"
                  ></textarea>
                </div>
              </div>
              <br />
              <div className="row">
                <label className="col-md sector">
                  About Me:
                  <textarea
                    value={this.state.aboutSelf}
                    onChange={this.handleChange}
                    rows="4"
                    cols="100"
                    className="textarea col sm={8}"
                    style={{ border: "none", backgroundColor: "#E3E2E2" }}
                  />
                </label>
              </div>
              {this.Prof()}
              <input
                type="submit"
                value="Save Changes"
                style={{ backgroundColor: "lightblue" }}
              />
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default SetingsOfProfile;
