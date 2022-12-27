import React, { useState, Fragment } from "react";
import diagnosticsAddSchema from "schemas/diagnosticAddSchema";
import { Formik, FieldArray, Field, ErrorMessage } from "formik";
import { Button, Form, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "./Diagnostics.css";
import debug from "sabio-debug";

const _logger = debug.extend("DiagnosticMedicalForm");

const MedicalForm = (props) => {
  const [medicalData] = useState(props.diagnosticsData);

  const initialValues = {
    medsSupplementsVitamins: [{ name: "" }],
    isInfection: false,
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
          <h3 className="mt-4 text-center">Medical</h3>
          <Formik
            enableReinitialize={true}
            initialValues={medicalData || initialValues}
            onSubmit={onNextClicked}
            validationSchema={diagnosticsAddSchema}
          >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group as={Col} md="12" controlId="name">
                  <Form.Group>
                    <FieldArray
                      name="medsSupplementsVitamins"
                      type="text"
                      value={values.medsSupplementsVitamins}
                      onChange={handleChange}
                      isInvalid={
                        touched.medsSupplementsVitamins &&
                        !!errors.medsSupplementsVitamins
                      }
                    >
                      {({ push, remove }) => (
                        <div>
                          <div>
                            Meds/Supplements/Vitamins
                            <button
                              className="btn btn-info checkboxSize margin-left"
                              type="button"
                              onClick={() => push({ name: "" })}
                            >
                              +
                            </button>
                          </div>
                          {values.medsSupplementsVitamins &&
                            values.medsSupplementsVitamins.map(
                              (meds, index) => (
                                <div className="row" key={index}>
                                  <div className="col-10">
                                    <Field
                                      type="text"
                                      name={`medsSupplementsVitamins.${index}.name`}
                                      className="form-control margin-top"
                                      placeholder="Add Medicines, Supplements, or Vitamins"
                                    />
                                  </div>
                                  <div className="col-2">
                                    <button
                                      className="btn btn-danger margin-top"
                                      type="button"
                                      onClick={() => remove(index)}
                                    >
                                      -
                                    </button>
                                  </div>
                                  <ErrorMessage
                                    name={`medsSupplementsVitamins.${index}.name`}
                                    component="div"
                                    className="validation-error-message"
                                  />
                                </div>
                              )
                            )}
                        </div>
                      )}
                    </FieldArray>
                  </Form.Group>
                  <label
                    htmlFor="isInfection"
                    className="form-label mb-3 margin-top check-text"
                  />
                  Infection
                  <input
                    type="checkbox"
                    name="isInfection"
                    checked={values.isInfection}
                    className="form-check-input checkbox-top checkboxSize margin-left"
                    onChange={handleChange}
                  ></input>
                  <Form.Control.Feedback type="invalid">
                    {errors.isInfection}
                  </Form.Control.Feedback>
                </Form.Group>

                <div>
                  <Button
                    variant="secondary"
                    type="button"
                    className="margin-top margin-right button-loc"
                    onClick={onBackClicked}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="button-loc"
                  >
                    Next
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Fragment>
  );
};

export default MedicalForm;

MedicalForm.propTypes = {
  diagnosticsData: PropTypes.shape({
    medsSupplementsVitamins: PropTypes.shape({
      name: PropTypes.string,
    }),
    isInfection: PropTypes.bool,
  }),
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
