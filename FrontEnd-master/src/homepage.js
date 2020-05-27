import React from "react";
import NavBar from "./homepagecomp/navbar";
import "./homepagecomp/homepage.css";
import LessonSelection from "./homepagecomp/lessonsSelect";
import "./homepagecomp/homepage.css";
import Online from "./homepagecomp/online";
import axios from "axios";
import Chat from "./homepagecomp/chat";
import Footer from "./homepagecomp/footer";
import VideoChat from "./homepagecomp/Call";
import Ring from "./ringVideo";
import StarRatingComponent from "react-star-rating-component";

import "whatwg-fetch";
import openSocket from "socket.io-client";
import { IoIosClose } from "react-icons/io";
const socket = openSocket("http://localhost:5000");

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      chat: false,
      loading: true,
      online: [],
      nameForChat: "1",
      idForChat: "",
      userRoom: null,
      selectedValue: "Nothing",
      name: null,
      videoPopUp: false,
      channel: "",
      ringCall: false,
      videoRating: false,
      stars: 1,
    };
  }

  componentDidMount() {
    socket.on(this.state.name, (name) => {
      var userRoom = name + this.state.name;
      console.log(userRoom);
      this.setState({ chat: true, nameForChat: name, userRoom: userRoom });
    });
    var video = this.state.name + "video";
    socket.on(video, (name) => {
      var userRoom = name + this.state.name;
      this.setState({ ringCall: true, channel: userRoom });
      console.log("Listening to user: " + name);
    });
  }

  componentWillMount() {
    if (this.props.location.state !== undefined) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify(this.props.location.state.token)
      );
    } else if (JSON.stringify(localStorage.getItem("currentUser"))) {
    } else {
      window.location.href = "/OnliEdu";
    }
    this.setState(
      {
        online: (
          <Online
            onClickHandler={(name, id) => this.onChatClickMe(name, id)}
            value={this.state.selectedValue}
            onVideoHandler={(name, id) => this.onVideoClick(name, id)}
          />
        ),
      },
      () => {
        this.setState({ loading: false });
      }
    );
    if (this.props.location.state) {
      this.setState({
        name: this.props.location.state.name,
        token: this.props.location.state.token,
      });
    } else {
      var user = JSON.parse(localStorage.getItem("profileUser"));
      var name = user.firstName;
      this.setState({ name: name });
    }
  }

  getNewProf = () => {
    this.setState({
      online: (
        <Online
          onClickHandler={(name, id) => this.onChatClickMe(name, id)}
          value={this.state.selectedValue}
          onVideoHandler={(name, id) => this.onVideoClick(name, id)}
        />
      ),
      selectedValue: "Nothing",
    });
  };

  logoutUser() {
    axios
      .get("http://localhost:5000/users/delete/session", {
        params: { userId: JSON.parse(localStorage.getItem("currentUser")) },
      })
      .then(() => {
        localStorage.clear();
        alert("logging out");
        window.location.href = "/OnliEdu";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onChatClickMe = (name, id) => {
    var nam = this.state.name;
    var userRoom = nam + name;
    this.setState(
      { nameForChat: name, idForChat: id, userRoom: userRoom },
      () => {
        this.setState({ chat: true });
      }
    );
    socket.emit("connected", { nam, name });
  };

  onVideoClick = (name, id) => {
    var nam = this.state.name;
    var userRoom = nam + name;
    socket.emit("videoConnection", { nam, name });
    this.setState({ videoPopUp: true, channel: userRoom });
  };

  onChildClick = () => {
    this.setState({ chat: false });
  };

  setLoadingState = () => {
    this.setState({ loading: false });
  };

  getSelectedValue = (val) => {
    if (val != "Select lesson") {
      this.setState({ selectedValue: val });
    }
  };

  onStarClick = (nextValue, prevValue, name) => {
    this.setState({ stars: nextValue });
  };

  render() {
    return this.state.loading ? (
      <h6>Loading...</h6>
    ) : (
      <div>
        <NavBar
          profile={JSON.parse(localStorage.getItem("currentUser"))}
          logout={this.logoutUser}
        />
        <br />

        <div style={{ marginRight: "20%", marginLeft: "10%" }}>
          <LessonSelection
            getSelectedValue={(val) => this.getSelectedValue(val)}
          />

          <div className="content">
            <div className="homepage-style-main">
              <h3 className="check-who">Check who can help you rigth now!</h3>
              {this.state.selectedValue == "Nothing"
                ? this.state.online
                : this.getNewProf()}
            </div>
          </div>
        </div>
        {this.state.chat && (
          <Chat
            closeMe={this.onChildClick}
            name={this.state.nameForChat}
            id={this.state.idForChat}
            userRoom={this.state.userRoom}
            nameOfUser={this.state.name}
          />
        )}
        {this.state.videoPopUp ? (
          <div className="popup">
            <div
              className="popup_inner"
              style={{ top: "15%", bottom: "15%", right: "15%", left: "15%" }}
            >
              <VideoChat channel={this.state.channel} />
              <button
                onClick={() => {
                  this.setState({ videoPopUp: false, videoRating: true });
                }}
                className="hangUp"
              >
                <IoIosClose size={35} />
              </button>{" "}
            </div>{" "}
          </div>
        ) : null}
        {this.state.ringCall && (
          <Ring
            acceptCall={() => {
              this.setState({ ringCall: false, videoPopUp: true });
            }}
            declineCall={() => {
              this.setState({ ringCall: false });
            }}
          />
        )}
        {this.state.videoRating && (
          <div className="popup">
            <div className="popup_inner starRating">
              <form onSubmit={this.handleSubmit} style={{ top: "50%" }}>
                <StarRatingComponent
                  name="star rating1"
                  onStarClick={this.onStarClick}
                />
                <br />
                <input
                  type="submit"
                  value="Submit"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    fontSize: "24px",
                  }}
                />
              </form>
            </div>
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

export default HomePage;
