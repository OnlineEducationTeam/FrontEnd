import React from "react";
import "./profiles.css";
import NavBar from "./homepagecomp/navbarProfile";
import axios from "axios";
import StarRatingComponent from "react-star-rating-component";
import Reviews from "./homepagecomp/reviews";
import Notes from "./homepagecomp/notes";
import Footer from "./homepagecomp/footer";

class educatorProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      description: "Submit your review",
      token: "",
      firstName: "",
      lastName: "",
      email: "",
      aboutSelf: "",
      review: "",
      stars: 1,
      loaded: false,
    };
  }
  async componentDidMount(props) {
    await this.start();
    this.setState({ loaded: true });
  }

  start = (props) => {
    if (this.props.location.params) {
      localStorage.setItem(
        "currentProfile",
        JSON.stringify(this.props.location.params)
      );
    }
    const user = JSON.parse(localStorage.getItem("currentProfile"));
    this.setState({
      token: user.id,
      firstName: user.name,
      lastName: user.surname,
      email: user.email,
      aboutSelf: user.aboutSelf,
    });
  };

  handleChangeReview = (event) => {
    this.setState({ review: event.target.value });
  };

  handleSubmit = (event) => {
    console.log(this.state);
    localStorage.removeItem("review");
    let rev = { id: this.state.token, review: this.state.review };
    localStorage.setItem("review", JSON.stringify(rev));
    this.save();
    event.preventDefault();
    this.props.history.push({
      pathname: "/OnliEdu/educatorProfile",
    });
  };

  onStarClick = (nextValue, prevValue, name) => {
    this.setState({ stars: nextValue });
  };

  save(props) {
    axios
      .post("http://localhost:5000/users/postreview/review", null, {
        params: {
          id: this.state.token,
          review: this.state.review,
          stars: this.state.stars,
        },
      })
      .then(() => {
        this.setState({ profReview: "", stars: "" });
        localStorage.removeItem("review");
      })
      .catch((err) => console.log(err));
  }

  content() {
    return (
      <div>
        <NavBar />
        <div
          className="container"
          style={{ marginRight: "5%", marginLeft: "5%" }}
        >
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
                    {this.state.firstName} {this.state.lastName}
                  </h5>
                  <small></small>
                </blockquote>
                <p>
                  {this.state.email} <br />
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md sector" style={{ fontWeight: "bold" }}>
              About Me:
              <div style={{ fontWeight: "normal" }}>{this.state.aboutSelf}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-md sector" style={{ fontWeight: "bold" }}>
              Notes:
              <br />
              <Notes
                id={JSON.parse(localStorage.getItem("currentProfile")).id}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md sector" style={{ fontWeight: "bold" }}>
              Reviews
              <Reviews
                id={JSON.parse(localStorage.getItem("currentProfile")).id}
              />
              <br />
              <div></div>
            </div>
          </div>
          <div className="row">
            <div className="col-md sector">
              <form onSubmit={this.handleSubmit}>
                <textarea
                  style={{ margin: "10px", width: "80%", outline: "none" }}
                  value={this.state.review}
                  onChange={this.handleChangeReview}
                />
                <StarRatingComponent
                  name="star rating"
                  onStarClick={this.onStarClick}
                />
                <input
                  type="submit"
                  value="Submit Review"
                  style={{ backgroundColor: "lightblue" }}
                />
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  render() {
    return <div>{this.state.loaded ? this.content() : null}</div>;
  }
}

export default educatorProfile;
