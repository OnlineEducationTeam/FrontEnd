import React from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import "./login.css";
import { Link } from "react-router-dom";
import axios from "axios";

/*Simple login form.*/

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  onChangeEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  onChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  onSubmit = (e, props) => {
    e.preventDefault();
    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    axios
      .post("http://localhost:5000/users/login", user)
      .then((res) => {
        this.props.history.push({
          pathname: "/OnliEdu/homepage",
          state: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="background" onSubmit={this.onSubmit}>
        <Form className="login-form">
          <h1 className="font-weight-bold text-center">OnliEdu</h1>
          <h6 className="text-center font-weight-light ">
            "learning without limits"
          </h6>
          <br />
          <div className="shadow-lg p-3 mb-5 bg-white rounded">
            <FormGroup>
              <Input
                type="email"
                placeholder="email"
                required
                onChange={this.onChangeEmail}
              ></Input>
              <span className="focus-border" />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                placeholder="password"
                required
                onChange={this.onChangePassword}
              ></Input>
              <span className="focus-border" />
            </FormGroup>
            <br />
            <Button
              type="Submit"
              value="login user"
              className="btn-lg btn-dark btn-block butn-color"
            >
              Log in
            </Button>
            <br />
            <div className="text-center">
              {/*If the person wnat to sign up he will be redirected to
              sign up pahe*/}
              <Link to="/OnliEdu/signup">Sign up</Link>
              <Link to="OnliEdu/underConstruction"> | Forgot Password</Link>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default Login;
