import React from "react";
import { Card, CardColumns, Container } from "react-bootstrap";
import style from "./Project.module.css";
import Fade from "react-reveal/Fade";

class Project extends React.Component {
  state = {
    flipped: {},
    backgroundColor: ""
  };

  flipCard = id => {
    this.setState(prevState => ({
      flipped: {
        ...prevState.flipped,
        [id]: !prevState.flipped[id]
      }
    }));
  };

  backgroundColor = () => {
    if (this.props.projects.actvityType === "organization") {
      this.setState({ backgroundColor: "primary" });
    } else if (this.props.projects.actvityType === "project") {
      this.setState({ backgroundColor: "warning" });
    }
  };

  getSdgImages = projectSDGs => {
    let projectSDGsArr = projectSDGs.split(",");
    let sdgArray = this.props.goals;
    const finalArray = [];
    projectSDGsArr.forEach(projectSDG =>
      sdgArray.forEach(sdg => {
        if (projectSDG === sdg.id) {
          finalArray.push(sdg.image);
        }
      })
    );
    const sdgImages = finalArray.map((data, index) => (
      <img key={index} src={data} width="auto" height="50" alt="goal" />
    ));
    return sdgImages;
  };

  displayThemes = themes => {
    let themesArr = themes.split(",");
    const themesDisplay = themesArr.map((data, index) => (
      <span key={index} className={style.theme}>
        {" "}
        {data}
      </span>
    ));
    return themesDisplay;
  };

  render() {
    return (
      <div className={style.projects}>
        <Container>
          <CardColumns>
            {this.props.projects.map((data, index) => (
              <div
                key={data.id}
                onClick={() => this.flipCard(data.id)}
                className={style.card}
              >
                {!this.state.flipped[data.id] ? (
                  <Fade bottom>
                    <Card
                      style={{ marginTop: "20px", textAlign: "center" }}
                      className={`${style.front} mb-4 p-3`}
                    >
                      <p style={{ color: "#a6a6a6" }}>{data.sector}</p>
                      <Card.Body>
                        <Card.Title style={{ fontSize: "20px" }}>
                          {data.projectname}
                        </Card.Title>
                        <Card.Text>{data.organization}</Card.Text>
                      </Card.Body>
                      <Card.Text>{this.getSdgImages(data.sdg)}</Card.Text>
                      <div style={{ display: "inline-block" }}>
                        {this.displayThemes(data.theme)}
                      </div>
                    </Card>
                  </Fade>
                ) : (
                  <Card
                    style={{
                      color: "white",
                      marginTop: "20px",
                      textAlign: "center",
                      backgroundColor:
                        data.activitytype === "organization"
                          ? "#ff9244"
                          : "#2c88c8"
                    }}
                    className={`${style.back} p-3`}
                  >
                    <i className="fas fa-undo" style={{ float: "right" }}></i>
                    <Card.Title>{data.projectname}</Card.Title>
                    <Card.Text>{data.organization}</Card.Text>
                    <small>{data.description}</small>
                    <br />
                    <Card.Link
                      className={style.readMore}
                      href={`${data.website}`}
                    >
                      Read More
                    </Card.Link>
                  </Card>
                )}
              </div>
            ))}
          </CardColumns>
        </Container>
      </div>
    );
  }
}
export default Project;