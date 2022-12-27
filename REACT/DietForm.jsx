import React, { useState, Fragment } from "react";
import diagnosticsAddSchema from "schemas/diagnosticAddSchema";
import { Formik } from "formik";
import { Button, Form, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "./Diagnostics.css";
import debug from "sabio-debug";

const _logger = debug.extend("DiagnosticDietForm");

const DietForm = (props) => {
  const [dietData] = useState(props.diagnosticsData);

  const initialValues = {
    currentDiet: "",
    isEating: false,
    isStanding: false,
    isSwelling: false,
  };

  const onBackClicked = (values) => {
    props.onBack(values);
    _logger(values, "values");
  };

  const onNextClicked = (values) => {
    props.onNext(values);
    _logger(values, "values");
  };

  return (
    <Fragment>
      <div>
        <div>
          <h3 className="mt-4 text-center">Diet</h3>
          <Formik
            enableReinitialize={true}
            initialValues={dietData || initialValues}
            onSubmit={onNextClicked}
            validationSchema={diagnosticsAddSchema}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group as={Col} md="12" controlId="currentDiet">
                  <Form.Label>Current Diet</Form.Label>
                  <Form.Control
                    name="currentDiet"
                    type="text"
                    value={values.currentDiet}
                    onChange={handleChange}
                    isInvalid={touched.currentDiet && !!errors.currentDiet}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.currentDiet}
                  </Form.Control.Feedback>
                  <label htmlFor="isEating" className="form-check-label">
                    Eating
                  </label>
                  <input
                    type="checkbox"
                    name="isEating"
                    className="form-check-input check-right checkboxSize margin-left"
                    checked={values.isEating}
                    onChange={handleChange}
                  ></input>
                  <Form.Control.Feedback type="invalid">
                    {errors.isEating}
                  </Form.Control.Feedback>
                  <label htmlFor="isStanding" className="form-label mb-3" />
                  Standing
                  <input
                    type="checkbox"
                    name="isStanding"
                    className="form-check-input check-right checkboxSize margin-left"
                    checked={values.isStanding}
                    onChange={handleChange}
                  ></input>
                  <Form.Control.Feedback type="invalid">
                    {errors.isStanding}
                  </Form.Control.Feedback>
                  <label
                    htmlFor="isSwelling"
                    className="form-label mb-3 margin-top check-text"
                  />
                  Swelling
                  <input
                    type="checkbox"
                    name="isSwelling"
                    className="form-check-input checkbox-top margin-left checkboxSize"
                    checked={values.isSwelling}
                    onChange={handleChange}
                  ></input>
                  <Form.Control.Feedback type="invalid">
                    {errors.isSwelling}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="secondary"
                  type="button"
                  onClick={onBackClicked}
                  className="button-loc"
                >
                  Back
                </Button>
                <Button variant="primary" type="submit" className="button-loc">
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

export default DietForm;

DietForm.propTypes = {
  diagnosticsData: PropTypes.shape({
    currentDiet: PropTypes.string,
    isEating: PropTypes.bool.isRequired,
    isStanding: PropTypes.bool.isRequired,
    isSwelling: PropTypes.bool.isRequired,
  }),
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
