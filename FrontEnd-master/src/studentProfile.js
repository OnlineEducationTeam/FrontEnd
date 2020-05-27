import React from "react";
import "./profiles.css";
import NavBar from "./homepagecomp/navbarProfile";
import { IoIosSettings } from "react-icons/io";
import axios from "axios";
import Reviews from "./homepagecomp/reviews";
import Footer from "./homepagecomp/footer";
import imag from "./default-image.png";

class studentProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      firstName: "",
      lastName: "",
      email: "",
      aboutSelf: "",
      professor: false,
      files: [],
      selectedImage: imag,
    };
  }
  componentWillMount() {
    const user = JSON.parse(localStorage.getItem("profileUser"));
    this.setState({
      token: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      aboutSelf: user.aboutSelf,
      professor: user.professor,
    });
  }

  componentDidMount() {
    this.loadImage();
  }

  loadImage() {
    var id = String(this.state.token);
    var path = "http://localhost:5000/photos/" + id;

    this.setState({ selectedImage: path });
  }

  onError = () => {
    if (!this.state.errored) {
      this.setState({
        selectedImage: imag,
      });
    }
  };

  handleSettings = (porps) => {
    this.props.history.push({
      pathname: "/OnliEdu/settings",
    });
  };

  loadNotes(props) {
    axios
      .get("http://localhost:5000/display/id", {
        params: {
          id: this.state.token,
        },
      })
      .then((res) => {
        this.setState({ files: res.data });
      });
  }

  downloadFile = (event) => {
    axios
      .get("http://localhost:5000/download/id", {
        params: {
          id: this.state.token,
          fileName: event.target.getAttribute("value"),
        },
        headers: {
          Accept: "application/pdf",
        },
        responseType: "blob",
      })
      .then((blob) => {
        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "hi.pdf");
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  };

  Professor = (props) => {
    this.loadNotes();
    const user = JSON.parse(localStorage.getItem("profileUser"));
    if (user.professor != null && user.professor === true) {
      var notes = [];
      var i = 0;
      for (i; i < this.state.files.length; i++) {
        notes.push(
          <li
            key={i}
            className="buttonFile"
            onClick={this.downloadFile}
            value={this.state.files[i]}
          >
            {this.state.files[i]}
          </li>
        );
      }

      return (
        <div className="sectionStyle">
          <div className="row">
            <div className="col-md sector">
              Notes:
              <div style={{ paddingTop: "10px" }}>
                <ul className="ul-file-position">{notes}</ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md sector">
              Reviews:
              <br />
              <Reviews id={user._id} />
            </div>
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
        <NavBar profile={this.state.token} className="navbar" />
        <div className="container">
          <div className="row">
            <div className="col-md-6 img ">
              <img
                src={this.state.selectedImage}
                alt=""
                className="img-rounded img-style"
                onError={this.onError}
              />
            </div>
            <div className="col-md-6 details">
              <blockquote>
                <h5>
                  {this.state.firstName} {this.state.lastName}{" "}
                  <button
                    style={{ border: "none", backgroundColor: "white" }}
                    onClick={this.handleSettings}
                  >
                    <IoIosSettings />
                  </button>
                </h5>
                <small></small>
              </blockquote>
              <p>
                {this.state.email} <br />
              </p>
            </div>
          </div>
          <div className="sectionStyle">
            <div
              rows="4"
              cols="50"
              className="textarea col sm={6} sector"
              style={{ marginLeft: "5px" }}
            >
              About Me:
              <br />
              <div className="container" style={{ fontWeight: "normal" }}>
                {this.state.aboutSelf}
              </div>
            </div>
          </div>
          {this.Professor()}
        </div>
        <Footer />
      </div>
    );
  }
}

export default studentProfile;
