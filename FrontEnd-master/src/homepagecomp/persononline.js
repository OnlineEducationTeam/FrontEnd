import React from "react";
import "./homepage.css";
import logo from "./image.png";
import { Link } from "react-router-dom";
import axios from "axios";
import StarRatingComponent from "react-star-rating-component";

class PersonOnline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      surname: "",
      rating: 4,
      email: "",
      aboutSelf: "",
      id: "",
      modalIsOpen: false,
    };
  }

  componentWillMount(props) {
    axios
      .get("http://localhost:5000/users/starratings/id", {
        params: { id: this.props.id },
      })
      .then((res) => {
        this.setState({ rating: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
    this.setState({
      id: this.props.id,
      name: this.props.firstName,
      surname: this.props.lastName,
      email: this.props.email,
      aboutSelf: this.props.aboutSelf,
      subject: this.props.subject,
    });
  }

  render(props) {
    return (
      <div className="container container-style">
        <div className="row">
          <div className="col-md-4">
            <div className="media style">
              <a className="thumbnail pull-left">
                <img className="media-object img-style" src={logo} />
              </a>
            </div>
          </div>
          <div className="col-md-5">
            <div className="info">
              <h5 className="media-heading">
                {this.state.name} {this.state.surname}{" "}
              </h5>{" "}
              <h6>({this.state.subject})</h6>
              <StarRatingComponent
                name="star rating"
                value={this.state.rating}
              />
            </div>
          </div>
          <div className="col-md-3 style1">
            <ul className="info">
              <li
                className="buttonfile1 theInfoDisplay"
                onClick={() =>
                  this.props.chatHandler(this.state.name, this.state.id)
                }
              >
                Live Chat
              </li>
              <li>
                <Link
                  to="/OnliEdu/underConstruction"
                  className="theInfoDisplay"
                >
                  Video Call
                </Link>
              </li>
              <li>
                <Link
                  to={{
                    pathname: "/OnliEdu/educatorProfile",
                    params: this.state,
                  }}
                  className="theInfoDisplay"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default PersonOnline;
