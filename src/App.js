import React from "react";
import "./App.css";
import * as spreadsheetData from "./data";
import Project from "./components/projects/Project.jsx";
import FilterMenu from "./components/filterMenu/FilterMenu.jsx";
import AddProject from "./components/form/AddProject.js";
import {
  Button,
  Modal,
  Spinner,
  Alert,
  Container,
  Row,
  Col
} from "react-bootstrap";
import SdgDescription from "./components/sdg-description/SdgDescription";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.resetPage = React.createRef();
    this.state = {
      projects: [],
      projectsDisplay: [],
      themes: [],
      sectors: [],
      goals: [],
      modal: false,
      searchError: false,
      loading: true,
      active: {},
      goalDescription: "",
      goalImage: null,
      goalColor: "",
      //Filters
      filters: [],

      theme: "",
      sdg: "",
      sector: "",
      activitytype: ""
    };
  }

  componentDidMount = () => {
    spreadsheetData.getSpreadsheet().then(this.spreadsheeetSuccess);
    spreadsheetData.getGoals().then(this.goalsSuccess);
  };

  spreadsheeetSuccess = data => {
    let themesSplit = [];
    let themesList = [];
    const themesArray = data.map(data => data.theme);
    for (let i = 0; i < themesArray.length; i++) {
      themesSplit.push(themesArray[i].split(","));
    }
    const themesArr = themesSplit.flat(1);
    for (let i = 0; i < themesArr.length; i++) {
      themesList.push(themesArr[i].trim());
    }
    const themesArrayNoDuplicates = Array.from(new Set(themesList));
    const themesAlphabetical = themesArrayNoDuplicates.sort();
    const sectorsArray = data.map(data => data.sector);
    const sectorsArrayNoDuplicates = Array.from(new Set(sectorsArray));
    const sectorsAlphabetical = sectorsArrayNoDuplicates.sort();
    this.setState({
      projects: data,
      projectsDisplay: data,
      themes: themesAlphabetical,
      sectors: sectorsAlphabetical,
      loading: false
    });
  };

  goalsSuccess = data => {
    this.setState({
      goals: data
    });
  };

  themeSelected = data => {
    const filterList = this.state.filters.concat(data);
    this.setState(
      prevState => ({
        filters: filterList,
        active: {
          [data]: !prevState.active[data]
        },
        theme: data
      }),
      () => this.filterProjects()
    );
  };

  sectorSelected = data => {
    const filterList = this.state.filters.concat(data);
    this.setState(
      prevState => ({
        filters: filterList,
        active: {
          [data]: !prevState.active[data]
        },
        sector: data
      }),
      () => this.filterProjects()
    );
  };

  goalSelected = (data, index) => {
    const filterList = this.state.filters.concat(data.name);
    this.setState(
      prevState => ({
        filters: filterList,
        active: {
          [index]: !prevState.active[index]
        },
        sdg: data.id
      }),
      () => this.filterProjects()
    );
  };

  projectsSelected = () => {
    const filterList = this.state.filters.concat("Projects");
    this.setState(
      {
        filters: filterList,
        activitytype: "project"
      },
      () => this.filterProjects()
    );
  };

  organizationsSelected = () => {
    const filterList = this.state.filters.concat("Organizations");
    this.setState(
      {
        filters: filterList,
        activitytype: "organization"
      },
      () => this.filterProjects()
    );
  };

  filterProjects = () => {
    let result = this.state.projects;

    if (this.state.theme) {
      result = result.filter(project =>
        project.theme.includes(this.state.theme)
      );
    }
    if (this.state.sdg) {
      result = result.filter(project =>
        project.sdg.split(",").includes(this.state.sdg)
      );
    }
    if (this.state.sector) {
      result = result.filter(project => project.sector === this.state.sector);
    }
    if (this.state.activitytype) {
      if (this.state.activitytype === "project") {
        result = result.filter(project => project.activitytype === "project");
      }
      if (this.state.activitytype === "organization") {
        result = result.filter(project => project.activitytype === "project");
      }
    }
    this.setState({
      projectsDisplay: result
    });
    this.resetPage.current.resetCurrentPage();
  };

  handleSearch = value => {
    const searchArr = this.state.projects.filter(entry =>
      Object.values(entry).some(
        val => typeof val === "string" && val.includes(value)
      )
    );
    this.setState({
      projectsDisplay: searchArr,
      searchError: false
    });
    if (searchArr.length === 0) {
      this.setState({
        searchError: true
      });
    }
    this.resetPage.current.resetCurrentPage();
  };

  resetFilter = () => {
    this.setState({
      projectsDisplay: this.state.projects,
      searchError: false,
      filters: [],
      goalDescription: "",
      goalImage: null,
      goalColor: ""
    });
    this.resetPage.current.resetCurrentPage();
  };

  handleShow = () => {
    this.setState({ modal: true });
  };

  handleClose = () => {
    this.setState({ modal: false });
  };

  deleteFilter = value => {
    console.log(value);
    this.setState(
      prevState => ({
        filters: prevState.filters.filter(item => item !== value)
      }),
      () => this.filterProjects()
    );
  };

  render() {
    return (
      <div style={{ backgroundColor: "white" }}>
        <div style={{ margin: "40px" }}>
          <h1 style={{ textAlign: "center", size: "7" }}>ACTIVITIES INDEX</h1>

          <p style={{ color: "rgb(16, 162, 198)", textAlign: "center" }}>
            ────────
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <Button
            className="add-project"
            type="button"
            onClick={() => {
              this.handleShow();
            }}
          >
            + ADD YOUR PROJECT
          </Button>
          <Modal
            show={this.state.modal}
            onHide={this.handleClose}
            animation={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Add Your Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddProject
                themes={this.state.themes}
                sectors={this.state.sectors}
                goals={this.state.goals}
              />
            </Modal.Body>
          </Modal>
        </div>
        <FilterMenu
          // selectedItem={this.itemSelected}
          themes={this.state.themes}
          sectors={this.state.sectors}
          selectTheme={this.themeSelected}
          selectSector={this.sectorSelected}
          searchProjects={this.handleSearch}
          selectProjects={this.projectsSelected}
          selectOrganizations={this.organizationsSelected}
          resetFilter={this.resetFilter}
          goals={this.state.goals}
          filters={this.state.filters}
          deleteFilter={this.deleteFilter}
          projects={this.state.projectsDisplay}
          selectGoal={this.goalSelected}
          active={this.state.active}
        />
        <br />
        <SdgDescription
          goalDescription={this.state.goalDescription}
          goalImage={this.state.goalImage}
          goalColor={this.state.goalColor}
        />
        {this.state.searchError ? (
          <Container>
            <Row className="justify-content-md-center">
              <Col>
                <Alert variant="danger">
                  No cards match your search. Please try filtering for the
                  content you are looking for.
                </Alert>
              </Col>
            </Row>
          </Container>
        ) : (
          <span></span>
        )}
        {this.state.loading ? (
          <Spinner
            animation="border"
            variant="info"
            style={{ position: "fixed", left: "50%" }}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <Project
            projects={this.state.projectsDisplay}
            goals={this.state.goals}
            ref={this.resetPage}
            sectors={this.state.sectors}
            selectTheme={this.themeSelected}
            selectSector={this.sectorSelected}
            selectGoal={this.goalSelected}
          />
        )}
      </div>
    );
  }
}

export default App;
