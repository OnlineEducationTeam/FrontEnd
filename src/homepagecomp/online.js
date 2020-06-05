import axios from "axios";
import React from "react";
import "./homepage.css";
import Person from "./persononline";

// Η κλάση online. Αντικείμενό της δημιουργείται στην αρχική σελίδα και περιέχει τους καθηγητές οι οποίοι είναι online

class Online extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      online: null,
      done: false,
    };
  }

  async componentWillMount() {
    await axios
      .get("http://localhost:5000/users/online")
      .then((res) => {
        localStorage.setItem("whoIsOnline", JSON.stringify(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
    var profOnline = JSON.parse(localStorage.getItem("whoIsOnline"));
    var prof = [];
    if (profOnline) {
      profOnline.forEach((element) => {
        prof.push(element.userId);
      });

      await axios
        .get("http://localhost:5000/users/findonline", {
          params: { id: prof },
        })
        .then((res) => {
          localStorage.setItem("professorsOnline", JSON.stringify(res.data));
          localStorage.removeItem("whoIsOnline");
        })
        .then(() => {
          this.loadusers();
        })
        .then(() => {
          this.setState({ done: true });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  loadusers = () => {
    var professor = JSON.parse(localStorage.getItem("professorsOnline"));
    var componet = [];
    if (professor) {
      for (var i = 0; i < professor.length; i++) {
        if (professor[i].subject != this.props.value) {
          componet.push(
            <Person
              key={i}
              id={professor[i]._id}
              lastName={professor[i].lastName}
              firstName={professor[i].firstName}
              email={professor[i].email}
              aboutSelf={professor[i].aboutSelf}
              subject={professor[i].subject}
              chatHandler={(name, id) => {
                this.props.onClickHandler(name, id);
              }}
            />
          );
        } else {
          componet.unshift(
            <Person
              key={i}
              id={professor[i]._id}
              lastName={professor[i].lastName}
              firstName={professor[i].firstName}
              email={professor[i].email}
              aboutSelf={professor[i].aboutSelf}
              subject={professor[i].subject}
              chatHandler={(name, id) => {
                this.props.onClickHandler(name, id);
              }}
            />
          );
        }
        localStorage.removeItem("professorsOnline");
      }
    }
    this.setState({ online: componet });
  };

  render(props) {
    return (
      <div className="online-container">
        {this.state.done ? this.state.online : <h6>Loading...</h6>}
      </div>
    );
  }
}

export default Online;
