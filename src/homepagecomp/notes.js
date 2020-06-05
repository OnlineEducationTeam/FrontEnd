import React from "react";
import axios from "axios";
import "../profiles.css";

/*
 Η κλάση αυτή ονομάζεται notes και αντικείμενά της καλούνται όταν χρειάζεται να δείξουμε στον χρήστη 
 τις σημειώσεις ενός καθηγητή
*/

class notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.id,
      files: [],
    };
  }

  // Με αυτή την συνάρτηση φορτώνουμε τις σημειώσεις στον χρήστη
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

  // Κατεβάζουμε το αρχείο που επιθυμούμε
  downloadFile = (event) => {
    var fileName = event.target.getAttribute("value");
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
        link.setAttribute("download", fileName);
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  };

  render() {
    this.loadNotes();
    const user = JSON.parse(localStorage.getItem("profileUser"));
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
    return <div>{notes}</div>;
  }
}

export default notes;
