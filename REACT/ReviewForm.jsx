import React, { Fragment, useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import PropTypes from "prop-types";
import "./Diagnostics.css";
import debug from "sabio-debug";
import * as horseService from "../../services/horseProfilesService";
import vetProfilesService from "components/vetprofile/vetProfilesService";

const _logger = debug.extend("DiagnosticReviewForm");

const ReviewForm = (props) => {
  const [fullDiagData] = useState(props.diagnosticsData);
  const currentUser = props.currentUser;

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
    getAllHorseProfiles();
  }, []);

  const getVetProfiles = () => {
    vetProfilesService
      .getCreatedBy(vetProfiles.pageIndex, vetProfiles.pageSize, currentUser.id)
      .then(getVetProfilesSuccess)
      .catch(getVetProfilesError);
  };

  const getAllHorseProfiles = () => {
    horseService
      .getAllHorseProfiles()
      .then(getHorseProfileSuccess)
      .catch(getHorseProfileError);
  };

  const getHorseProfileSuccess = (response) => {
    _logger("Get Horse Profile", response);
    let profArr = response.items;
    setHorseProfiles((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfHorseProfiles = profArr;
      pd.profileComponents = pd.arrayOfHorseProfiles.map(horseProfileMapper);
      return pd;
    });
  };

  const getHorseProfileError = (response) => {
    _logger(response);
  };

  const horseProfileMapper = (profile) => {
    if (profile.id === fullDiagData.horseProfileId) {
      return (
        <option key={profile.id} value={profile.id}>
          {profile.name}
        </option>
      );
    }
  };

  const getVetProfilesSuccess = (response) => {
    _logger("get Vet Profiles---> ", response);
    let vetArr = response.item.pagedItems;
    setVetProfiles((prevState) => {
      const pd = { ...prevState };
      pd.arrayOfVetProfiles = vetArr;
      pd.vetPracticeComponents = pd.arrayOfVetProfiles.map(vetPracticeMapper);
      return pd;
    });
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

  const onBackClicked = (values) => {
    props.onBack(values);
    _logger(values, "values");
  };

  const onSubmit = (values) => {
    _logger(values, "values");
    props.onNext();
  };

  const mapMeds = (meds) => {
    if (meds !== null) {
      return (
        <option key={meds.id} value={meds.id}>
          {meds.name}
        </option>
      );
    }
  };
  const listMeds = fullDiagData?.medsSupplementsVitamins?.map(mapMeds);

  return (
    <Fragment>
      <Table className="diagnostics-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Entry</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th> Horse Profile </th>
            <th> {horseProfiles.profileComponents} </th>
          </tr>
          <tr>
            <th>Practice </th>
            <th> {vetProfiles.vetPracticeComponents} </th>
          </tr>
          <tr>
            <th> Health Description </th>
            <th className="font-weight"> {fullDiagData.healthDescription} </th>
          </tr>
          <tr>
            <th> Current Diet </th>
            <th className="font-weight"> {fullDiagData.currentDiet} </th>
          </tr>
          <tr>
            <th> Meds/Supplements/Vitamins </th>
            <th className="font-weight">{listMeds}</th>
          </tr>
          <tr>
            <th> Weight </th>
            <th className="font-weight"> {fullDiagData.weight} </th>
          </tr>
          <tr>
            <th> Temperature </th>
            <th className="font-weight"> {fullDiagData.temp} </th>
          </tr>
          <tr>
            <th> Eating </th>
            <th className="font-weight"> {String(fullDiagData.isEating)} </th>
          </tr>
          <tr>
            <th> Standing </th>
            <th className="font-weight"> {String(fullDiagData.isStanding)} </th>
          </tr>
          <tr>
            <th> Swelling </th>
            <th className="font-weight"> {String(fullDiagData.isSwelling)} </th>
          </tr>
          <tr>
            <th> Infection </th>
            <th className="font-weight">{String(fullDiagData.isInfection)}</th>
          </tr>
          <tr>
            <th> Archived </th>
            <th className="font-weight"> {String(fullDiagData.isArchived)} </th>
          </tr>
        </tbody>
      </Table>

      <div className="mt-5">
        <Button
          type="submit"
          variant="secondary"
          className="btn me-3"
          onClick={onBackClicked}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="btn"
          onClick={onSubmit}
        >
          Submit
        </Button>
      </div>
    </Fragment>
  );
};

export default ReviewForm;

ReviewForm.propTypes = {
  diagnosticsData: PropTypes.shape({
    currentDiet: PropTypes.string,
    healthDescription: PropTypes.string,
    horseProfileId: PropTypes.number.isRequired,
    practiceId: PropTypes.number.isRequired,
    weight: PropTypes.number,
    temp: PropTypes.number,
    isEating: PropTypes.bool.isRequired,
    isStanding: PropTypes.bool.isRequired,
    isSwelling: PropTypes.bool.isRequired,
    isInfection: PropTypes.bool.isRequired,
    isArchived: PropTypes.bool.isRequired,
  }),
  medsSupplementsVitamins: PropTypes.shape({
    name: PropTypes.string,
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
