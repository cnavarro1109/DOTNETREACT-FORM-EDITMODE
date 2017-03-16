import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, FormGroup, Form, Col, ControlLabel, FormControl, Panel, Grid, Row, Table } from 'react-bootstrap';
import serializeForm from 'form-serialize';

import update from 'react-addons-update'; // ES6

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      editMode: false,
      editRecordData: [],
      falseRecord: []
    };

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._loadServiceAPIData = this._loadServiceAPIData.bind(this);
    this._deleteRecord = this._deleteRecord.bind(this);
    this._editRecord = this._editRecord.bind(this);
    this._loadEditRecord = this._loadEditRecord.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  componentDidMount() {
    this._loadServiceAPIData();
  }

  _loadServiceAPIData() {

    var self = this;
    fetch('/api/values')
      .then(function (response) {
        return response.json();
      }).then(function (responseData) {
        console.log("LoadServiceAPI: " + responseData);
        self.setState({ tableData: responseData });
      });
  }

  _deleteRecord(event) {

    event.preventDefault();
    console.log("Starting to delete");

    self = this;
    var itemId = event.target.value;

    //Send the request to _deleteReacord
    fetch('/api/values/' + itemId,
      {
        method: 'DELETE',
        mode: 'cors'
      }).then(function (response) {
        console.log("RESPONSE: " + response);
        self._loadServiceAPIData();
        //self.setState({ editMode: true });
      });

  }

  /*
   Loads the record that is going to be editable
  */
  _loadEditRecord(event) {

    event.preventDefault();
    const recordId = event.target.value;

    console.log("EDIT RECORD ID: " + recordId);

    self = this;

    fetch('/api/values/' + recordId,
      {
        method: 'GET',
        mode: 'cors'
      }).then(function (response) {
        return response.json();
      }).then(function (responseData) {
        console.log("RESPONSE: " + JSON.stringify(responseData));
        self.setState({ editMode: true, editRecordData: responseData });
      });

  }

  /*
     Submit the new record values
     Event is going to be the form, 
     event.target.value, make sure the form has a field containing
     the unique identity of the record that you are modifying.
     User serializeForm method to convert the form into a JSON string.
  */
  _editRecord(event) {
    event.preventDefault();

    var value = event.target.value;
    alert('Edit Record' + value);
  }

  _handleChange(event) {

    var elementName = event.target.name;
    var elementValue = event.target.value;

    console.log(elementName + " : " + elementValue);

    this.setState({
      falseRecord: [],
      //editRecordData: update(this.state.editRecordData, { 0: { elementName: { $set: elementValue } } })
      editRecordData: update(this.state.editRecordData, { 1: { elementName: { $set: elementValue } } })
    });
  }

  _handleFormSubmit(event) {
    event.preventDefault();

    self = this;
    let formData = serializeForm(event.target, { hash: true });
    console.log("HandleFormSubmit: " + JSON.stringify(formData));

    fetch('/api/values', {
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
      },
      mode: 'cors',
      body: JSON.stringify(formData)
    }).then(function (res) {
      self._loadServiceAPIData(); //Reload the data
      console.log("End of Fetch: " + JSON.stringify(res))

      //Reset the editMode value to false
      self.setState({ editMode: false });
    });

  }

  render() {

    //this._loadServiceAPIData();
    var dtSource = this.state.tableData;
    var dtRecordData = this.state.editRecordData;
    console.log("Render: " + dtSource);

    var self = this;
    var rows =
      Object.keys(dtSource).map(function (key) {
        return (<tr>
          <td>Key: {key}</td>
          <td>{dtSource[key]["itemName"]}</td>
          <td>{dtSource[key]["quantity"]}</td>
          <td>
            <button type="submit" value={dtSource[key]['testId']} onClick={self._deleteRecord}>
              DELETE
            </button>
            <button type="submit" value={dtSource[key]['testId']} onClick={self._loadEditRecord}>
              EDIT
            </button>
          </td>
        </tr>);
      })


    const formInstance = (

      <Form horizontal onSubmit={this._handleFormSubmit}>

        <FormGroup controlId="formHorizontalItemName">
          <Col componentClass={ControlLabel} sm={2}>
            Item Name
      </Col>
          <Col sm={10}>
            <FormControl type="text" name="ItemName" placeholder="Item Name" />
          </Col>
        </FormGroup>

        <FormGroup controlId="formHorizontalQuantity">
          <Col componentClass={ControlLabel} sm={2}>
            Quantity
          </Col>
          <Col sm={10}>
            <FormControl type="text" name="Quantity" placeholder="Quantity" />
          </Col>
        </FormGroup>

        <FormGroup>
          <Col smOffset={7} sm={8}>
            <Button type="submit">
              Add
            </Button>
          </Col>
        </FormGroup>

      </Form>



    );

    const tableInstance = (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>Item ID </th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    );

    /*
    TASK: Render a form with the value of the record
    that you requested.
    */
    var editForm =
      Object.keys(dtRecordData).map(function (key) {
        return (
          <Form horizontal onSubmit={self._handleFormSubmit}>

            <FormGroup controlId="formHorizontalItemName">
              <Col sm={10}>
                <FormControl type="hidden" name="TestId" value={dtRecordData[key]["testId"]} onChange={self._handleChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalItemName">
              <Col componentClass={ControlLabel} sm={2}>
                Item Name
          </Col>
              <Col sm={10}>
                <FormControl type="text" name="ItemName" placeholder="Item Name" value={dtRecordData[key]["itemName"]} onChange={self._handleChange} />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalQuantity">
              <Col componentClass={ControlLabel} sm={2}>
                Quantity
          </Col>
              <Col sm={10}>
                <FormControl type="text" name="Quantity" placeholder="Quantity" value={dtRecordData[key]["quantity"]} onChange={self._handleChange} />
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={7} sm={8}>
                <Button type="submit">
                  Update
            </Button>
              </Col>
            </FormGroup>

          </Form>);
      });


    var output = (
      <div className="App">
        <Grid>
          <Row className="show-grid">
            <Col xs={6} md={2}></Col>
            <Col xs={6} md={8}>
              <Panel>
                {formInstance}
              </Panel>
            </Col>
          </Row>
        </Grid>
        {tableInstance}
      </div>
    );

    if (self.state.editMode == false) {
      output = (
        <div className="App">
          <Grid>
            <Row className="show-grid">
              <Col xs={6} md={2}></Col>
              <Col xs={6} md={8}>
                <Panel>
                  {formInstance}
                </Panel>
              </Col>
            </Row>
          </Grid>
          {tableInstance}
        </div>
      );
    } else {
      output = (
        <div>{editForm}</div>
      );
    }

    return (
      <div className="App">
        {output}
      </div>
    );
  }
}

export default App;
