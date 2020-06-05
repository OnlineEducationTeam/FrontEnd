import React from "react";
import "./profiles.css";
import NavBar from "./homepagecomp/navbarProfile";
import { IoIosSettings } from "react-icons/io";
import axios from "axios";
import Reviews from "./homepagecomp/reviews";
import Footer from "./homepagecomp/footer";

/*
Αυτή η κλάση αποτελεί το profil του χρήστη. όταν ένας χρήστης επισκέπτεται το δικό του προφίλ, τότε καλείται αυτή.

*/

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
    };
  }

  // Η συνάρτηση καλείται όταν φορτώσει η σελίδα
  componentDidMount() {
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
  handleSettings = (porps) => {
    this.props.history.push({
      pathname: "/OnliEdu/settings",
    });
  };

  // συνάρτηση για να φορτώσουν οι σημειώσεις
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

  // συνάρτηση για download αρχείου
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

  // Αν ο χρήστης που βλέπει το προφίλ του είναι καθηγητής, τότε θέλουμε να βλέπει τις σημειώσεις του και τις κριτικές του
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
              <div>
                <ul>{notes}</ul>
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
          <div className="sectionStyle">
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

            <div className="row ">
              <div className="col-md sector">
                About Me:
                <br />
                <div className="container" style={{ fontWeight: "normal" }}>
                  {this.state.aboutSelf}
                </div>
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
