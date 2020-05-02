import React from "react";
import NavBar from "./homepagecomp/navbarProfile";
import axios from "axios";
import "./profiles.css";
import Footer from "./homepagecomp/footer";
import imag from "./default-image.png";

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
      done: false,
      selectedImage: imag,
      defImage: null,
    };
  }

  componentWillMount() {
    const user = JSON.parse(localStorage.getItem("profileUser"));
    const id = JSON.parse(localStorage.getItem("currentUser"));
    this.setState(
      {
        token: id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        aboutSelf: user.aboutSelf,
        professor: user.professor,
      },
      () => {
        this.loadImage();
      }
    );
  }

  loadImage() {
    var id = String(this.state.token);
    var path = "http://localhost:5000/photos/" + id;
    this.setState({ selectedImage: path });
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

  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      this.setState({ defImage: event.target.files[0] });
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ selectedImage: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  onError = () => {
    if (!this.state.errored) {
      this.setState({
        selectedImage: imag,
      });
    }
  };

  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
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
    const data1 = new FormData();
    data1.append("file", this.state.defImage);
    await axios
      .post("http://localhost:5000/uploadPhoto", data1, {
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
        <NavBar profile={this.state.token} />
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-md-6 img">
                <img
                  src={this.state.selectedImage}
                  alt=""
                  className="img-rounded img-style"
                  onError={this.onError}
                />
                <input
                  type="file"
                  onChange={this.onImageChange}
                  style={{
                    float: "right",
                    textAlign: "rigth",
                    paddingTop: "5px",
                  }}
                />
              </div>
              <div className="col-md-6 details">
                <blockquote>
                  <textarea
                    value={this.state.firstName}
                    onChange={this.handleChangeName}
                    className="textarea1 settings"
                  ></textarea>
                  <br />
                  <textarea
                    value={this.state.lastName}
                    onChange={this.handleChangeSurname}
                    className="textarea1 settings"
                  ></textarea>
                  <small></small>
                </blockquote>
                <textarea
                  value={this.state.email}
                  onChange={this.handleChangeEmail}
                  className="textarea1 settings"
                ></textarea>
              </div>
            </div>
            <br />
            <div className="sectionStyle">
              <div className="row">
                <label className="col sm={6} sector">
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
            </div>
          </form>
        </div>
        <Footer />
      </div>
    );
  }
}

export default SetingsOfProfile;
