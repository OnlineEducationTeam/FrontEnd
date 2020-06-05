import React from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import { Link } from "react-router-dom";
import "./signup.css";
import axios from "axios";

/*The sign up form. The person that signs up has to put his personal info
Later that will be stored in a base*/

/*
Κλάση signup. Καλείται όταν ένας νέος χρήστης επιθυμεί να κάνει εγγραφή στην εφαρμογή μας
*/

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      professor: "",
      subject: "",
    };
  }

  onChangeFirstName = (e) => {
    this.setState({
      firstName: e.target.value,
    });
  };
  onChangeLastName = (e) => {
    this.setState({
      lastName: e.target.value,
    });
  };
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
  onChangeConfirmPassword = (e) => {
    this.setState({
      confirmPassword: e.target.value,
    });
  };
  onChangeProfessor = (e) => {
    console.log(e.target.value);
    if (e.target.value === "professor") {
      this.setState({
        professor: true,
      });
    } else if (e.target.value === "student") {
      this.setState({
        professor: false,
      });
    } else {
      alert("Please select if you are a student or a professor");
    }
  };
  onChangeSubject = (e) => {
    this.setState({
      subject: e.target.value,
    });
  };

  onSubmit = (e) => {
    const { password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      alert("Passwords don't match");
    } else {
      e.preventDefault();
      const user = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        professor: this.state.professor,
        subject: this.state.subject,
      };

      console.log(user);

      axios
        .post("http://localhost:5000/users/signup", user)
        .then((res) => console.log("Welcome " + user.firstName));
    }

    window.location = "/OnliEdu";
  };

  render() {
    return (
      <div className="background">
        <Form className="login-form" onSubmit={this.onSubmit}>
          <h1 className="font-weight-bold text-center">OnliEdu</h1>
          <h6 className="text-center font-weight-light ">
            "learning without limits"
          </h6>
          <br />
          <div className="shadow-lg p-3 mb-5 bg-white rounded">
            <FormGroup>
              <Input
                type="text"
                placeholder="First Name"
                required
                onChange={this.onChangeFirstName}
              ></Input>
              <span className="focus-border" />
            </FormGroup>
            <FormGroup>
              <Input
                type="text"
                placeholder="Last Name"
                required
                onChange={this.onChangeLastName}
              ></Input>
              <span className="focus-border" />
            </FormGroup>
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
            <FormGroup>
              <Input
                type="password"
                placeholder="Repeat password"
                required
                onChange={this.onChangeConfirmPassword}
              ></Input>
              <span className="focus-border" />
            </FormGroup>
            <br />
            <FormGroup>
              <Input
                type="text"
                placeholder="Subject"
                onChange={this.onChangeSubject}
              ></Input>
              <span className="focus-border" />
            </FormGroup>
            <br />
            <select
              title={"What are you?"}
              name="professor"
              placeholder="What are you?"
              className="form-control"
              onChange={this.onChangeProfessor}
            >
              <option value="select">Select</option>
              <option value="professor">Professor</option>
              <option value="student">Student</option>
            </select>
            <br />

            <Button
              type="Submit"
              value="create user"
              className="btn-lg btn-dark btn-block butn-color"
            >
              Sign up
            </Button>
            <Link to="/OnliEdu/homepage">Continue to page</Link>
            <br />
          </div>
        </Form>
      </div>
    );
  }
}

export default SignUp;
