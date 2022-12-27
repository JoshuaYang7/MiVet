import React, { useState, useEffect } from "react";
import debug from "sabio-debug";
import { Formik, Field } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import Stack from "react-bootstrap/Stack";
import toastr from "toastr";
import "toastr/build/toastr.css";
import SingleDiagnostic from "./SingleDiagnostic";
import "./Diagnostics.css";
import { Row, Col, Card, Container, Button, Form } from "react-bootstrap";
import vetProfilesService from "components/vetprofile/vetProfilesService";
import * as horseService from "../../services/horseProfilesService";
import diagnosticServices from "services/diagnosticService";
import ViewMore from "./ViewMore";
import { formatDateTime } from "../../utils/dateFormater";

function Diagnostics({ currentUser }) {
  const _logger = debug.extend("Diagnostics");

  const [pageData] = useState({
    pageIndex: 0,
    pageSize: 10,
    searchInput: "",

    currentDiet: "",
    healthDescription: "",
    medsSupplementsVitamins: [{ name: "" }],
    horseProfileId: 0,
    practiceId: "",
    weight: "",
    temp: "",
    isEating: false,
    isStanding: false,
    isSwelling: false,
    isInfection: false,
    isArchived: false,
    dateCreated: "",
  });

  const [diagnostics, setDiagnostics] = useState({
    arrayOfDiagnostics: [],
    diagComponents: [],
    searchedDiagComponents: [],
  });

  const [dateComponents, setDateComponents] = useState({
    arrayOfDates: [],
    dateCreatedComponents: [],
  });

  const [vetProfiles, setVetProfiles] = useState({
    pageIndex: 0,
    pageSize: 10,
    arrayOfVetProfiles: [],
    vetProfileComponents: [],
    vetPracticeComponents: [],
  });

  const [horseProfiles, setHorseProfiles] = useState({
    searchInput: "",
    arrayOfHorseProfiles: [],
    horseComponents: [],
    horseComps: [],
  });

  useEffect(() => {
    getVetProfiles();
    getHorseProfiles();
  }, []);

  const getVetProfiles = () => {
    vetProfilesService
      .getCreatedBy(vetProfiles.pageIndex, vetProfiles.pageSize, currentUser.id)
      .then(getVetProfilesSuccess)
      .catch(getVetProfilesError);
  };

  const getVetProfilesSuccess = (response) => {
    _logger("get Vet Profiles---> ", response);
    let vetArr = response.item.pagedItems;
    setVetProfiles((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfVetProfiles = vetArr;
      pd.vetProfileComponents = pd.arrayOfVetProfiles.map(vetProfileMapper);
      pd.vetPracticeComponents = pd.arrayOfVetProfiles.map(vetPracticeMapper);
      return pd;
    });
  };

  const vetProfileMapper = (vet) => {
    let vetImage = vet.createdBy.userImage;
    return (
      <span key={vet.id} value={vet.id}>
        <img
          src={vetImage}
          alt={"VetImageHere"}
          className="diag-img-size"
        ></img>
        <span>
          {vet.createdBy.firstName} {vet.createdBy.lastName}
        </span>
      </span>
    );
  };

  const vetPracticeMapper = (vet) => {
    return (
      <option key={vet.id} value={vet.id}>
        {vet.practices[0].practiceName}
      </option>
    );
  };

  const getVetProfilesError = (response) => {
    _logger(response);
  };

  const getHorseProfiles = () => {
    horseService
      .getAllHorseProfiles()
      .then(getHorseSuccess)
      .catch(getHorseError);
  };

  const getHorseSuccess = (response) => {
    _logger("Get Horse Profiles -->", response);
    let horse = response.items;
    const filterHorseByVet = horse.filter(filterHorse);
    setHorseProfiles((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfHorseProfiles = filterHorseByVet;
      pd.horseComponents = pd.arrayOfHorseProfiles.map(horseProfileMapper);
      pd.horseComps = pd.arrayOfHorseProfiles.map(horseNameMapper);
      return pd;
    });
  };

  const horseProfileMapper = (profile) => {
    return (
      <ViewMore
        key={profile.id}
        value={profile.id}
        horse={profile}
        onViewClick={onViewClick}
      ></ViewMore>
    );
  };

  const horseNameMapper = (profile) => {
    return (
      <option key={profile.id} value={profile.id}>
        {profile.name}
      </option>
    );
  };

  const filterHorse = (horse) => {
    let result = false;
    if (horse.createdBy === currentUser.id) {
      result = true;
    }
    return result;
  };

  const getHorseError = (response) => {
    _logger(response);
  };

  const [toggleDiagSearch, setToggleDiagSearch] = useState(false);

  const onViewClick = (diag) => {
    diagnosticServices
      .getDiagByHorseId(pageData.pageIndex, pageData.pageSize, diag.id)
      .then(getDiagByIdSuccess)
      .catch(getDiagByIdError);
    setToggleDiagSearch(!toggleDiagSearch);
  };

  const getDiagByIdSuccess = (response) => {
    _logger(response);
    let diag = response.item.pagedItems;
    setDiagnostics((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfDiagnostics = diag;
      pd.diagComponents = pd.arrayOfDiagnostics.map(diagMapper);
      _logger(pd.diagComponents);
      return pd;
    });
    setDateComponents((prevState) => {
      const dc = { ...prevState };
      dc.arrayOfDates = diag;
      dc.dateCreatedComponents = dc.arrayOfDates.map(dateMapper);
      _logger(dc.dateCreatedComponents);
      return dc;
    });
  };

  const diagMapper = (diag) => {
    _logger("Mapping single Diagnostic -->", diag);
    return (
      <SingleDiagnostic
        diagnostic={diag}
        key={diag.id}
        onEditClick={onEditClick}
      ></SingleDiagnostic>
    );
  };

  const dateMapper = (diag) => {
    _logger("Mapping Diagnostic Dates -->", diag);
    return (
      <option key={diag.id} value={diag.id}>
        {formatDateTime(diag.dateCreated)}
      </option>
    );
  };

  const filterDiagnostics = (e) => {
    let value = parseInt(e?.target?.value, 10);
    _logger(value);
    const filterDiag = (diag) => {
      let result = false;
      if (value === diag.id) {
        result = true;
      } else {
        result = false;
      }
      return result;
    };
    setDiagnostics((prevState) => {
      let pd = { ...prevState };
      pd.searchedDiagComponents = diagnostics.arrayOfDiagnostics
        .filter(filterDiag)
        .map(diagMapper);
      pd.diagComponents = diagMapper(diagnostics.arrayOfDiagnostics[0]);
      return pd;
    });
  };

  const getDiagByIdError = (response) => {
    toastr.error("Diagnostic does not exist");
    _logger(response);
  };

  const navigate = useNavigate();
  const onEditClick = (diag) => {
    const idForEdit = diag.id;
    const stateForTransport = { type: "Diag_View", payload: diag };
    navigate(`/diagnostics/editdiag/${idForEdit}`, {
      state: stateForTransport,
    });
  };

  const onSearchClicked = (values, { resetForm }) => {
    _logger("search values -->", values);
    let searchInput = values.searchInput;
    horseService
      .searchUserHorses(pageData.pageIndex, pageData.pageSize, searchInput)
      .then(getHorseByQuerySuccess)
      .catch();
    resetForm();
  };

  const getHorseByQuerySuccess = (response) => {
    _logger("Search Horse Profiles -->", response);
    let horse = response.item.pagedItems;
    setHorseProfiles((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfHorseProfiles = horse;
      pd.horseComponents = pd.arrayOfHorseProfiles.map(horseProfileMapper);
      _logger(pd);
      return pd;
    });
  };

  const onResetClicked = (e) => {
    e.preventDefault();
    getHorseProfiles();
  };

  return (
    <React.Fragment>
      <div className="py-4 py-lg-3 bg-colors-gradient ">
        <Col lg={{ span: 12, offset: 5 }} md={5} sm={5}>
          <div className="mb-4 mb-lg-0">
            <h1 className="d-lg-flex mb-lg-0 text-black diag-text">
              <strong>Diagnostics</strong>
              <div className="diagbtn">
                <Link to="/diagnostics/new" className="btn btn-danger">
                  Add Diagnostic
                </Link>
              </div>
            </h1>
          </div>
        </Col>
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={pageData}
        onSubmit={onSearchClicked}
      >
        {({ handleSubmit, handleChange, values }) => (
          <Container fluid>
            <Row>
              <Col xs={4}>
                <Card className="mt-4">
                  <Stack direction="horizontal" gap={3}>
                    <Card.Header className="mb-3">
                      <h3 className="mb-0 mt-0">
                        <strong>Patients</strong>
                      </h3>
                      <Form noValidate onSubmit={handleSubmit}>
                        <Field
                          type="text"
                          className="form-control"
                          name="searchInput"
                          onChange={handleChange}
                          placeholder="Search Patient"
                          value={values.searchInput}
                        ></Field>
                        <Button
                          className="btn-sm diag-float-right"
                          type="submit"
                        >
                          Search
                        </Button>
                        <Button
                          className="btn-sm btn-warning diag-float-right"
                          type="btn"
                          onClick={onResetClicked}
                        >
                          Reset
                        </Button>
                      </Form>
                    </Card.Header>
                  </Stack>
                  {horseProfiles.horseComponents}
                </Card>
              </Col>
              <Col xs={8}>
                {toggleDiagSearch && (
                  <Card className="mt-4">
                    <Form onSubmit={handleSubmit}>
                      <Card.Header>
                        <strong> Diagnostics History</strong>
                        <Field
                          as="select"
                          className="form-select"
                          name="diagComponents"
                          onChange={filterDiagnostics}
                          value={values.id}
                        >
                          <option label="Select" value="select"></option>
                          {dateComponents.dateCreatedComponents}
                        </Field>
                      </Card.Header>
                    </Form>
                  </Card>
                )}
                <Card className="mt-3">
                  {diagnostics.searchedDiagComponents}
                </Card>
              </Col>
            </Row>
          </Container>
        )}
      </Formik>
    </React.Fragment>
  );
}

export default Diagnostics;

Diagnostics.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
