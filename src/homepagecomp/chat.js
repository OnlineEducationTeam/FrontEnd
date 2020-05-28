import React from "react";
import "./chat.css";
import { IoIosCloseCircle } from "react-icons/io";

import "whatwg-fetch";
import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:5000");

class chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      send: false,
      messages: [],
      name: this.props.name,
      id: this.props.id,
      room: this.props.userRoom
    };
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  componentWillMount() {
    var userRoom = this.state.room;
    var nf = this.state.name;
    socket.emit("join", { nf, userRoom });
  }

  sendSocketIO = message => {
    var room = this.state.room;
    if (room == null) {
      var room = this.props.nameOfUser + this.props.name;
    }
    var name = this.props.name;
    socket.emit("roomMessage", { room, message, name });
  };

  sendMessage = message => {
    this.setState({
      messages: [
        ...this.state.messages,
        <div
          className="row msg_container base_sent"
          key={message + this.state.message}
        >
          <div className="col-md-10 col-xs-10 ">
            <div className="messages msg_sent">
              <p>{message}</p>
            </div>
          </div>
        </div>
      ]
    });
    this.sendSocketIO(message);
  };

  receiveMessage = message => {
    this.setState({
      messages: [
        ...this.state.messages,
        <div className="row msg_container base_receive" key={message}>
          <div className="col-xs-10 col-md-10">
            <div
              className="messages msg_receive"
              style={{ backgroundColor: "lightgrey" }}
            >
              <p>{message}</p>
            </div>
          </div>
        </div>
      ]
    });
  };

  handleMessage = event => {
    this.sendMessage(this.state.message);
    this.setState({ message: "", send: true });

    event.preventDefault();
  };

  handleChange = event => {
    this.setState({
      message: event.target.value
    });
  };

  handleClick = props => {
    this.setState({
      sned: false,
      messages: [],
      message: ""
    });
    this.props.closeMe();
  };

  componentDidMount() {
    socket.on("roomMessage", info => {
      this.receiveMessage(info.message);
    });
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render(props) {
    return (
      <div className="container position">
        <div
          className="row chat-window col-xs-5 col-md-3"
          id="chat_window_1"
          style={{ marginLeft: "10px", position: "fixed" }}
        >
          <div className="col-xs-12 col-md-12">
            <div className="panel panel-default">
              <div className="panel-heading top-bar">
                {this.state.name}
                <button
                  onClick={this.handleClick}
                  style={{
                    right: "0px",
                    position: "absolute",
                    backgroundColor: "inherit",
                    border: "none"
                  }}
                >
                  <IoIosCloseCircle />
                </button>
                <div className="col-md-8 col-xs-8">
                  <h3 className="panel-title">
                    <span className="glyphicon glyphicon-comment"></span>
                  </h3>
                </div>
                <div
                  className="col-md-4 col-xs-4"
                  style={{ textAlign: "right" }}
                >
                  <span
                    id="minim_chat_window"
                    className="glyphicon glyphicon-minus icon_minim"
                  ></span>

                  <span
                    className="glyphicon glyphicon-remove icon_close"
                    data-id="chat_window_1"
                  ></span>
                </div>
              </div>
              <div className="panel-body msg_container_base">
                {this.state.messages}
                <div
                  style={{ float: "left", clear: "both" }}
                  ref={el => {
                    this.messagesEnd = el;
                  }}
                ></div>
              </div>

              <div className="panel-footer">
                <form onSubmit={this.handleMessage}>
                  <div className="input-group">
                    <textarea
                      id="btn-input"
                      style={{ resize: "none", height: "38px" }}
                      className="form-control input-sm chat_input"
                      placeholder="Write your message here..."
                      value={this.state.message}
                      onChange={this.handleChange}
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-primary btn-sm" id="btn-chat">
                        Send
                      </button>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="btn-group dropup">
          <button
            type="button"
            className="btn btn-default dropdown-toggle"
            data-toggle="dropdown"
          >
            <span className="glyphicon glyphicon-cog"></span>
            <span className="sr-only">Toggle Dropdown</span>
          </button>
          <ul className="dropdown-menu" role="menu">
            <li>
              <span className="glyphicon glyphicon-plus"></span> Novo
            </li>
            <li>
              <span className="glyphicon glyphicon-list"></span> Ver outras
            </li>
            <li>
              <span className="glyphicon glyphicon-remove"></span> Fechar Tudo
            </li>
            <li className="divider"></li>
            <li>
              <span className="glyphicon glyphicon-eye-close"></span> Invisivel
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default chat;
