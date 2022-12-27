import React, { useState, Fragment, useEffect } from "react";
import diagnosticsAddSchema from "schemas/diagnosticAddSchema";
import { Formik, Field, ErrorMessage } from "formik";
import { Form, Col, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "./Diagnostics.css";
import debug from "sabio-debug";
import * as horseService from "../../services/horseProfilesService";
import vetProfilesService from "components/vetprofile/vetProfilesService";

const _logger = debug.extend("DiagnosticProfileForm");

const ProfileForm = (props) => {
  const [profileData] = useState(props.diagnosticsData);
  const currentUser = props.currentUser;

  const initialValues = {
    horseProfileId: "",
    weight: "",
    temp: "",
    healthDescription: "",
    practiceId: "",
    isArchived: false,
  };

  const [horseProfiles, setHorseProfiles] = useState({
    id: "",
    name: "",
    arrayOfHorseProfiles: [],
    profileComponents: [],
  });

  const [vetProfiles, setVetProfiles] = useState({
    id: "",
    name: "",
    pageIndex: 0,
    pageSize: 10,
    arrayOfVetProfiles: [],
    vetProfileComponents: [],
    vetPracticeComponents: [],
  });

  useEffect(() => {
    getVetProfiles();
    getHorseProfiles();
  }, []);

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
      return pd;
    });
  };

  const getHorseError = (response) => {
    _logger(response);
  };

  const filterHorse = (horse) => {
    let result = false;
    if (horse.createdBy === currentUser.id) {
      result = true;
    }
    return result;
  };

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
      <option key={vet.id} value={vet.id}>
        <img src={vetImage} alt={"VetImageHere"}></img>
        {vet.createdBy.firstName}
        {vet.createdBy.lastName}
      </option>
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

  const horseProfileMapper = (profile) => {
    return (
      <option key={profile.id} value={profile.id}>
        {profile.name}
      </option>
    );
  };

  const onNextClicked = (values) => {
    _logger(values, "on Next Clicked");
    props.onNext(values);
  };

  return (
    <Fragment>
      <div>
        <div>
          <h3 className="mt-4 text-center">Profile</h3>
          <Formik
            enableReinitialize={true}
            initialValues={profileData || initialValues}
            onSubmit={onNextClicked}
            validationSchema={diagnosticsAddSchema}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group as={Col} md="12" controlId="name">
                  <Form.Label className="margin-top">Practice</Form.Label>
                  <Field
                    as="select"
                    className="form-select"
                    name="practiceId"
                    onChange={handleChange}
                    value={values.practiceId}
                    isInvalid={touched.practiceId && !!errors.practiceId}
                  >
                    <option label="Select"> </option>
                    {vetProfiles.vetPracticeComponents ||
                      profileData.practiceId.name}
                  </Field>
                  <ErrorMessage
                    className="validation-error-message"
                    name="practiceId"
                    component="div"
                  />
                  <Form.Label>Horse</Form.Label>
                  <Field
                    as="select"
                    className="form-select"
                    name="horseProfileId"
                    onChange={handleChange}
                    value={values.horseProfileId}
                    isInvalid={
                      touched.horseProfileId && !!errors.horseProfileId
                    }
                  >
                    <option value=""> Select </option>
                    {horseProfiles.horseComponents}
                  </Field>
                  <ErrorMessage
                    className="validation-error-message"
                    name="horseProfileId"
                    component="div"
                  />
                  <Form.Label className="margin-top">
                    Health Description
                  </Form.Label>
                  <Form.Control
                    name="healthDescription"
                    type="text"
                    value={values.healthDescription}
                    placeholder="Enter Health Description"
                    onChange={handleChange}
                    isInvalid={
                      touched.healthDescription && !!errors.healthDescription
                    }
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.healthDescription}
                  </Form.Control.Feedback>
                  <Form.Label className="margin-top">Weight</Form.Label>
                  <Form.Control
                    name="weight"
                    type="text"
                    value={values.weight}
                    placeholder="Enter Weight"
                    onChange={handleChange}
                    isInvalid={touched.weight && !!errors.weight}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.weight}
                  </Form.Control.Feedback>
                  <Form.Label className="margin-top">Temperature</Form.Label>
                  <Form.Control
                    name="temp"
                    type="text"
                    value={values.temp}
                    placeholder="Enter Temperature"
                    onChange={handleChange}
                    isInvalid={touched.temp && !!errors.temp}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.temp}
                  </Form.Control.Feedback>
                  <label
                    htmlFor="isArchived"
                    className="form-label mb-3 check-text"
                  />
                  Archived
                  <input
                    type="checkbox"
                    name="isArchived"
                    className="form-check-input checkbox-top checkboxSize margin-left"
                    checked={values.isArchived}
                    onChange={handleChange}
                  ></input>
                  <Form.Control.Feedback type="invalid">
                    {errors.isArchived}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="margin-top button-loc"
                >
                  Next
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfileForm;

ProfileForm.propTypes = {
  diagnosticsData: PropTypes.shape({
    healthDescription: PropTypes.string,
    horseProfileId: PropTypes.number.isRequired,
    practiceId: PropTypes.number.isRequired,
    weight: PropTypes.number,
    temp: PropTypes.number,
    isArchived: PropTypes.bool.isRequired,
  }),
  horseProfiles: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }),
  params: PropTypes.number,
  onNext: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
