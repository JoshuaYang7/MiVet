import React from "react";
import PropTypes from "prop-types";
import { Table, Button, Col, Row } from "react-bootstrap";

function ViewMore(props) {
  const horse = props.horse;

  const onLocalViewClicked = (e) => {
    e.preventDefault();
    props.onViewClick(horse, e);
  };

  return (
    <Table>
      <Row className="border-bottom">
        <Col xs={{ offset: 0, span: 7 }}>
          <div>
            <h4 className="mb-1">
              <img
                src={horse.primaryImageUrl}
                alt="ImgHere"
                className="diag-img-size3"
              ></img>
              <span> {horse.name}</span>
            </h4>
          </div>
        </Col>
        <Col xs={{ offset: 1, span: 1 }}>
          <Button
            type="submit"
            variant="outline-light bg-primary primary"
            onClick={onLocalViewClicked}
          >
            View
          </Button>
        </Col>
      </Row>
    </Table>
  );
}

export default ViewMore;

ViewMore.propTypes = {
  horse: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    primaryImageUrl: PropTypes.string,
  }),
  onViewClick: PropTypes.func,
  onEditClick: PropTypes.func,
};
