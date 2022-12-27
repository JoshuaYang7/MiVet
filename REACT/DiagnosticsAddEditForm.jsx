import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import diagnosticServices from "../../services/diagnosticService";
import diagnosticAddSchema from "../../schemas/diagnosticAddSchema";
import "./Diagnostics.css";

import debug from "sabio-debug";

import toastr from "toastr";
import "../../toastr/build/toastr.css";

const _logger = debug.extend("AddEditDiagnostic");

function AddEditDiagnostic() {
  const [pageData, setPageData] = useState({
    currentDiet: "",
    healthDescription: "",
    medsSupplementsVitamins: "",
    horseProfileId: "",
    practiceId: "",
    weight: "",
    temp: "",
    isEating: "",
    isStanding: "",
    isSwelling: "",
    isInfection: "",
    isArchived: "",
  });

  const params = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    _logger("Firing Effect for Single Diag");
    if (state?.type === "DIAGNOSTIC_EDIT") {
      setPageData(pageData);
    }
    _logger(pageData);

    if (state !== null && state.payload !== null) {
      setPageData((prevState) => {
        const diag = { ...prevState };
        const diagUpdate = state.payload;

        diag.currentDiet = diagUpdate.currentDiet;
        diag.healthDescription = diagUpdate.healthDescription;
        diag.medsSupplementsVitamins = diagUpdate.medsSupplementsVitamins;
        diag.horseProfileId = diagUpdate.horseProfileId;
        diag.practiceId = diagUpdate.practiceId;
        diag.weight = diagUpdate.weight;
        diag.temp = diagUpdate.temp;

        return diag;
      });
    }
  }, [state]);

  useEffect(() => {
    _logger("Firing Effect for GET Diagnostics");
    if (params) {
      diagnosticServices
        .getDiagById(params.id)
        .then(getByIdSuccess)
        .catch(getByIdError);
    }
  }, []);

  const getByIdSuccess = (response) => {
    _logger(response);
    toastr.success("Get Success", "update success");
    const diagTest = response.item;

    setPageData((prevState) => {
      var pd = { ...prevState };
      pd = diagTest;
      pd.horseProfileId = diagTest.horseProfile.id;

      _logger(pd);
      return pd;
    });
  };

  const getByIdError = (response) => {
    _logger(response);
  };

  const handleSubmit = (values) => {
    _logger(values);
    const payload = { ...values };
    payload.isEating = values.isEating === "true" ? true : false;
    payload.isStanding = values.isStanding === "true" ? true : false;
    payload.isSwelling = values.isSwelling === "true" ? true : false;
    payload.isInfection = values.isInfection === "true" ? true : false;
    payload.isArchived = values.isArchived === "true" ? true : false;

    payload.horseProfileId = parseInt(values.horseProfileId);
    payload.practiceId = parseInt(values.practiceId);
    payload.weight = parseInt(values.weight);
    payload.temp = parseInt(values.temp);

    if (params.id) {
      payload.id = params.id;
      diagnosticServices
        .updateDiagnostic(payload)
        .then(onUpdateSuccess)
        .catch(onUpdateError);
    } else {
      diagnosticServices
        .addDiagnostic(payload)
        .then(onAddSuccess)
        .catch(onAddError);
    }
  };

  const onUpdateSuccess = (response) => {
    _logger(response);
    toastr.success("Update Success", "update success");
    navigate("/diagnostics");
  };
  const onUpdateError = (response) => {
    _logger(response);
    toastr.error("Update Error", "update Error");
  };
  const onAddSuccess = (response) => {
    _logger(response);
    toastr.success("Add Success", "Add success");
    navigate("/diagnostics");
  };
  const onAddError = (response) => {
    _logger(response);
    toastr.error("Add Error", "Add Error");
  };

  return (
    <React.Fragment>
      <div className="container-fluid">
        <Formik
          initialValues={pageData}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={diagnosticAddSchema}
        >
          <Form>
            <h1>Add / Edit Diagnostic</h1>
            <hr />
            <div className="form-group">
              <label htmlFor="currentDiet" className="form-label mb-3" />
              Current Diet
              <Field
                type="text"
                className="form-control"
                placeholder="Enter Current Diet"
                name="currentDiet"
              />
              <ErrorMessage
                name="currentDiet"
                component="div"
                className="has-error"
              />
            </div>
            <div className="form-group">
              <label htmlFor="healthDescription" className="form-label mb-3" />
              Health Description
              <Field
                type="text"
                className="form-control"
                placeholder="Enter Health Description"
                name="healthDescription"
              />
              <ErrorMessage
                name="healthDescription"
                component="div"
                className="has-error"
              />
            </div>
            <label
              htmlFor="medsSupplementsVitamins"
              className="form-label mb-3"
            />
            Meds/Supplements/Vitamins
            <Field
              type="text"
              className="form-control"
              placeholder="Enter Medicine, Supplements, or Vitamins"
              name="medsSupplementsVitamins"
            ></Field>
            <ErrorMessage
              name="medsSupplementsVitamins"
              component="div"
              className="has-error"
            />
            <label htmlFor="horseProfileId" className="form-label mb-3" />
            Horse Profile Id
            <Field
              type="text"
              className="form-control"
              placeholder="Enter Horse Profile Id"
              name="horseProfileId"
            ></Field>
            <ErrorMessage
              name="horseProfileId"
              component="div"
              className="has-error"
            />
            <label htmlFor="practiceId" className="form-label mb-3" />
            Practice
            <Field
              type="text"
              className="form-control"
              placeholder="Enter Practice Id"
              name="practiceId"
            ></Field>
            <ErrorMessage
              name="practiceId"
              component="div"
              className="has-error"
            />
            <label htmlFor="weight" className="form-label mb-3" />
            Weight
            <Field
              type="text"
              className="form-control"
              placeholder="Enter Weight"
              name="weight"
            ></Field>
            <ErrorMessage name="weight" component="div" className="has-error" />
            <label htmlFor="temp" className="form-label mb-3" />
            Temperature
            <Field
              type="text"
              className="form-control"
              placeholder="Enter Temperature"
              name="temp"
            ></Field>
            <ErrorMessage name="temp" component="div" className="has-error" />
            <label htmlFor="isEating" className="form-label mb-3" />
            Eating
            <Field as="select" className="form-select" name="isEating">
              <option value=""> Select </option>
              <option value={true}> Yes </option>
              <option value={false}> No </option>
            </Field>
            <label htmlFor="isStanding" className="form-label mb-3" />
            Standing
            <Field as="select" className="form-select" name="isStanding">
              <option value=""> Select </option>
              <option value={true}> Yes </option>
              <option value={false}> No </option>
            </Field>
            <label htmlFor="isSwelling" className="form-label mb-3" />
            Swelling
            <Field as="select" className="form-select" name="isSwelling">
              <option value=""> Select </option>
              <option value={true}> Yes </option>
              <option value={false}> No </option>
            </Field>
            <label htmlFor="isInfection" className="form-label mb-3" />
            Infection
            <Field as="select" className="form-select" name="isInfection">
              <option value=""> Select </option>
              <option value={true}> Yes </option>
              <option value={false}> No </option>
            </Field>
            <label htmlFor="isArchived" className="form-label mb-3" />
            Archived
            <Field as="select" className="form-select" name="isArchived">
              <option value=""> Select </option>
              <option value={true}> Yes </option>
              <option value={false}> No </option>
            </Field>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </React.Fragment>
  );
}

export default AddEditDiagnostic;
