import React, { useState, Fragment, useEffect } from "react";
import { Col } from "react-bootstrap";
import debug from "sabio-debug";
import ProfileForm from "./ProfileForm";
import ReviewForm from "./ReviewForm";
import DietForm from "./DietForm";
import MedicalForm from "./MedicalForm";
import { FaRegGrin } from "react-icons/fa";
import { PropTypes } from "prop-types";
import Loki from "react-loki";
import "./Diagnostics.css";
import diagnosticServices from "services/diagnosticService";
import toastr from "toastr";
import "../../toastr/build/toastr.css";
import { useNavigate, useLocation } from "react-router-dom";

const _logger = debug.extend("DiagnosticsWizardForm");

const DiagnosticsWizardForm = ({ currentUser }) => {
  const [diagnosticData, setDiagnosticsData] = useState({
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
  });

  const [renderLoki, setRenderLoki] = useState(false);
  const { state } = useLocation();

  // UseLocation Edit
  useEffect(() => {
    _logger("FiringEffect for GET diagnostic", state);
    setRenderLoki(true);
    if (
      state !== null &&
      state.payload !== null &&
      state?.type === "Diag_View"
    ) {
      const diag = { ...state.payload };
      _logger(diag);
      diag.horseProfileId = state.payload.horseProfile.id;
      if (state.payload.medsSupplementsVitamins !== null) {
        diag.medsSupplementsVitamins =
          state.payload.medsSupplementsVitamins.map((meds) => {
            return meds;
          });
      } else {
        diag.medsSupplementsVitamins = "";
      }
      _logger("state for update --> ", diag);
      setDiagnosticsData(diag);
      setRenderLoki(true);
    }
  }, []);

  const mergeValues = (values) => {
    _logger(values, "values");
    setDiagnosticsData((prevState) => {
      const pd = { ...prevState, ...values };
      return pd;
    });
  };

  const mySteps = [
    {
      label: "Step 1",
      icon: <FaRegGrin className="mt-3" />,
      component: (
        <ProfileForm
          diagnosticsData={diagnosticData}
          currentUser={currentUser}
        />
      ),
    },
    {
      label: "Step 2",
      icon: <FaRegGrin className="mt-3" />,
      component: (
        <DietForm diagnosticsData={diagnosticData} currentUser={currentUser} />
      ),
    },
    {
      label: "Step 2",
      icon: <FaRegGrin className="mt-3" />,
      component: <MedicalForm diagnosticsData={diagnosticData} />,
    },
    {
      label: "Step 2",
      icon: <FaRegGrin className="mt-3" />,
      component: (
        <ReviewForm
          diagnosticsData={diagnosticData}
          currentUser={currentUser}
        />
      ),
    },
  ];

  const onSubmitClick = () => {
    _logger(diagnosticData);
    const payload = {
      currentDiet: diagnosticData.currentDiet,
      healthDescription: diagnosticData.healthDescription,

      medsSupplementsVitamins:
        diagnosticData.medsSupplementsVitamins.map(mapMeds),

      horseProfileId: parseInt(diagnosticData.horseProfileId),
      practiceId: parseInt(diagnosticData.practiceId),
      weight: parseInt(diagnosticData.weight),
      temp: parseInt(diagnosticData.temp),
      isEating: diagnosticData.isEating === true ? true : false,
      isStanding: diagnosticData.isStanding === true ? true : false,
      isSwelling: diagnosticData.isSwelling === true ? true : false,
      isInfection: diagnosticData.isInfection === true ? true : false,
      isArchived: diagnosticData.isArchived === true ? true : false,
    };
    _logger(payload);
    if (diagnosticData.id) {
      _logger(diagnosticData);
      diagnosticServices
        .updateDiagnostic(payload, diagnosticData.id)
        .then(onUpdateSuccess)
        .catch(onUpdateError);
    } else {
      diagnosticServices
        .addDiagnostic(payload)
        .then(onAddSuccess)
        .catch(onAddError);
    }
  };
  const mapMeds = (meds) => {
    return meds.name;
  };

  const navigate = useNavigate();

  const onAddSuccess = (response) => {
    _logger(response);
    toastr.success("Diagnostic Added");
    navigate("/diagnostics");
  };
  const onAddError = (response) => {
    _logger(response);
    toastr.error("Add Error");
  };
  const onUpdateSuccess = (response) => {
    _logger(response);
    toastr.success("Diagnostic Updated");
    navigate("/diagnostics");
  };
  const onUpdateError = (response) => {
    _logger(response);
    toastr.error("Update Error");
  };

  return (
    <Fragment>
      <Col xl={6} xs={12} className="mx-auto mt-5 card">
        <div className="mb-3 mb-md-0">
          <h1 className="text-center margin-top">Diagnostic</h1>
        </div>
        <div className="form-diagnostic mb-5">
          {renderLoki && (
            <Loki
              steps={mySteps}
              onNext={mergeValues}
              onBack={mergeValues}
              onFinish={onSubmitClick}
              noActions
            />
          )}
        </div>
      </Col>
    </Fragment>
  );
};

export default DiagnosticsWizardForm;

DiagnosticsWizardForm.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};
