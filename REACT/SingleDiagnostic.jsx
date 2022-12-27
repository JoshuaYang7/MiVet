import React, { useState } from "react";
import Stack from "react-bootstrap/Stack";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import { Row, Card, Button } from "react-bootstrap";
import { useMemo } from "react";
import * as horseService from "../../services/horseProfilesService";
import { formatDateTime } from "../../utils/dateFormater";

const _logger = debug.extend("SingleDiagnostic");

function SingleDiagnostic(props) {
  const diagnostics = props.diagnostic;
  _logger(diagnostics);

  const [horseProfile, setHorseProfile] = useState({
    id: "",
    name: "",
    avatarUrl: "",
    ownerInfo: {
      firstName: "",
      lastName: "",
      avatarUrl: "",
    },
  });

  const getHorseProfile = () => {
    horseService
      .getByHorseId(diagnostics.horseProfile.id)
      .then(getHorseByIdSuccess)
      .catch(getHorseByIdError);
  };

  const getHorseByIdSuccess = (response) => {
    let horseProfile = response.item;
    setHorseProfile((prevState) => {
      const pd = { ...prevState };
      pd.id = horseProfile.id;
      pd.name = horseProfile.name;
      pd.avatarUrl = horseProfile.primaryImageUrl;
      pd.ownerInfo.firstName = horseProfile.ownerInfo.firstName;
      pd.ownerInfo.lastName = horseProfile.ownerInfo.lastName;
      pd.ownerInfo.avatarUrl = horseProfile.ownerInfo?.avatarUrl;
      return pd;
    });
  };
  const getHorseByIdError = (response) => {
    _logger(response);
  };

  useMemo(getHorseProfile, []);

  const mapMeds = (meds) => {
    return (
      <option key={meds.id} value={meds.id}>
        {meds.name}
      </option>
    );
  };

  const onLocalEditClicked = (e) => {
    e.preventDefault();
    props.onEditClick(diagnostics, e);
  };

  return (
    <React.Fragment>
      <Row className="diagnosticCards-container">
        <Card.Header>
          <h5 className="mb-0">
            <strong>Patient Name</strong>
          </h5>
          <Stack direction="horizontal" gap={3}>
            <img
              className="diag-img-size"
              src={horseProfile.avatarUrl}
              alt="horseImg"
            ></img>
            {horseProfile.name}
            <Stack direction="vertical" gap={1} className="col-md-5 mx-auto">
              <span className="diag-float-right">
                <strong>Created: </strong>
                {formatDateTime(diagnostics.dateCreated)}
              </span>
              <p>
                <strong>Modified: </strong>
                {formatDateTime(diagnostics.dateModified)}
              </p>
            </Stack>
            <Button
              type="submit"
              className="diag-button-float-right"
              variant="outline-light bg-primary primary"
              onClick={onLocalEditClicked}
            >
              Edit
            </Button>
          </Stack>
        </Card.Header>
        <Card.Header>
          <div>
            <h5 className="mb-0">
              <strong>Health Description</strong>
            </h5>
            <p className="mt-2 mb-1">{diagnostics.healthDescription}</p>
          </div>
        </Card.Header>
        <Card.Header>
          <div>
            <h5 className="mb-0">
              <strong>Medicine/Supplements/Vitamins </strong>
            </h5>
            <p className="mt-2 mb-1">
              {diagnostics.medsSupplementsVitamins?.map(mapMeds)}
            </p>
          </div>
        </Card.Header>
        <Card.Header>
          <div>
            <h5 className="mb-0">
              <strong>Current Diet</strong>
            </h5>
            <p className="mt-2 mb-1">{diagnostics.currentDiet}</p>
          </div>
        </Card.Header>
        <Card.Header>
          <h5 className="mb-0">
            <strong>Standing</strong>
          </h5>
          <p className="mt-2 mb-1">{String(diagnostics.isStanding)}</p>
        </Card.Header>
        <Card.Header>
          <h5 className="mb-0">
            <strong>Eating</strong>
          </h5>
          <p className="mt-2 mb-1">{String(diagnostics.isEating)}</p>
        </Card.Header>
        <Card.Header>
          <h5 className="mb-0">
            <strong>Swelling</strong>
          </h5>
          <p className="mt-2 mb-1">{String(diagnostics.isSwelling)}</p>
        </Card.Header>
        <Card.Header>
          <h5 className="mb-0">
            <strong>Infection</strong>
          </h5>
          <p className="mt-2 mb-1">{String(diagnostics.isInfection)}</p>
        </Card.Header>
        <Card.Header className="py-5 py-lg-3 diag-width bg-colors-gradient">
          <h5 className="mb-0">
            <strong>Horse Owner</strong>
          </h5>
          <img
            className="diag-img-size2"
            src={horseProfile.ownerInfo?.avatarUrl}
            alt="Imgalt"
          ></img>{" "}
          {horseProfile.ownerInfo.firstName} {horseProfile.ownerInfo.lastName}
        </Card.Header>
      </Row>
    </React.Fragment>
  );
}

export default SingleDiagnostic;

SingleDiagnostic.propTypes = {
  diagnostic: PropTypes.shape({
    currentDiet: PropTypes.string,
    healthDescription: PropTypes.string,
    medsSupplementsVitamins: PropTypes.string,
    horseProfileId: PropTypes.number,
    horseProfile: PropTypes.shape({
      id: PropTypes.number,
    }),
    practiceId: PropTypes.number,
    weight: PropTypes.number,
    temp: PropTypes.number,
    isEating: PropTypes.bool.isRequired,
    isStanding: PropTypes.bool.isRequired,
    isSwelling: PropTypes.bool.isRequired,
    isInfection: PropTypes.bool.isRequired,
    isArchived: PropTypes.bool.isRequired,
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string,
  }),
  horse: PropTypes.shape({
    id: PropTypes.number,
    ownerInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
  }),
  onEditClick: PropTypes.func,
};
