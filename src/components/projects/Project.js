import React from "react";
import { Card, CardColumns } from "react-bootstrap";
import style from "./Project.module.css";

class Project extends React.Component {
  state = {
    flipped: {}
  };

  flipCard = id => {
    this.setState(prevState => ({
      flipped: {
        ...prevState.flipped,
        [id]: !prevState.flipped[id]
      }
    }));
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
      <img key={index} src={data} width="auto" height="30" alt="goal" />
    ));
    return sdgImages;
  };

  render() {
    return (
      <div style={{ margin: "20px" }}>
        <CardColumns>
          {this.props.projects.map((data, index) => (
            <div
              key={data.id}
              onClick={() => this.flipCard(data.id)}
              className={style.card}
            >
              {!this.state.flipped[data.id] ? (
                <Card className={`${style.front} p-3`}>
                  <p>{data.sector}</p>
                  <Card.Body
                    style={{
                      textAlign: "center",
                      backgroundColor: "lightgrey"
                    }}
                  >
                    <Card.Title>{data.projectname}</Card.Title>
                    <Card.Text>{data.organization}</Card.Text>
                  </Card.Body>
                  <Card.Text>{this.getSdgImages(data.sdg)}</Card.Text>
                  <p style={{ textAlign: "right" }}>{data.theme}</p>
                </Card>
              ) : (
                <Card
                  bg="primary"
                  style={{
                    color: "white",
                    textAlign: "center"
                  }}
                  className={`${style.back} p-3`}
                >
                  <i className="fas fa-undo" style={{ float: "right" }}></i>
                  <Card.Title>{data.projectname}</Card.Title>
                  <Card.Text>{data.organization}</Card.Text>
                  <small>{data.description}</small>
                  <br />
                  <Card.Link href={`${data.website}`}>Read More</Card.Link>
                </Card>
              )}
            </div>
          ))}
        </CardColumns>
      </div>
    );
  }
}
export default Project;
