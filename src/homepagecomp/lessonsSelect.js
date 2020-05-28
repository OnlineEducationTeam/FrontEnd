import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import "./homepage.css";

class LessonsSelection extends React.Component {
  constructor() {
    super();
    this.state = {
      lesson: [
        "Math",
        "Physics",
        "English",
        "Chemistry",
        "Literature",
        "Management",
      ],
      options: null,
    };
  }

  componentWillMount() {
    this.howmany();
  }

  handleChange = (e) => {
    this.props.getSelectedValue(e.target.innerHTML);
  };

  howmany = () => {
    var options = [];
    var i = 0;
    for (i; i <= this.state.lesson.length; i++) {
      options.push(
        <Dropdown.Item value={this.state.lesson[i]}>
          {this.state.lesson[i]}
        </Dropdown.Item>
      );
    }
    this.setState({ options: options });
  };

  render() {
    return (
      <DropdownButton
        id="dropdown-basic-button"
        title="Select lesson"
        className="dropdown-style"
        value={this.state.selectValue}
        onClick={this.handleChange}
      >
        {this.state.options}
      </DropdownButton>
    );
  }
}

export default LessonsSelection;
