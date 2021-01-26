import React from 'react';
import { Badge, Button, Container, Col, Row, Form } from 'react-bootstrap';
import config from '../config';
import {get_balance, send_amount} from '../utils/smService';
import Loader from 'react-loader-spinner'

/* eslint-disable import/first */
var ethUtil = require('ethereumjs-util')
var sigUtil = require('eth-sig-util')
var Eth = require('ethjs')
window.Eth = Eth
import Web3 from 'web3';
// Instantiate web3
let web3


const ethEnabled = () => {
    if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      window.ethereum.enable();
      return true;
    }
    return false;
  }
if(!ethEnabled()) {  
 web3 = new Web3(config.node_api);
}else{
    web3 = window.web3;
}

class Transaction extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {address: '0x', amount: 0 };
      const { loading, balance_s, balance_r } = this.state;
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
    async getBalance(){
      let balance = await get_balance(config.account_address);
      return balance
    }
    
    handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
    }
    
    async  handleSubmit(event) {
      event.preventDefault();
      this.setState({ loading: true });
      let data =  await send_amount(this.state.address, this.state.amount);
    }
  
    render() {
      
      return (
        <Container>
          <Row>
            <Col>
            <Form.Label column sm="18">
                  </Form.Label>
            </Col>
          </Row>  
          <Row>
            <Col>
            <Form style={{textAlign:'center', margin:90}}>
                <h1 style={{textAlign:'center', margin:90}}>Relayer demo</h1>
                <Form.Group as={Row} controlId="formAddress">
                  <Form.Label column sm="2">
                    Custumer
                  </Form.Label>
                  <Col sm="10">
                  <Form.Control value={this.state.address} name="address" onChange={this.handleChange} />
                  </Col>
                </Form.Group>
              
                <Form.Group as={Row} controlId="formAmount">
                  <Form.Label column sm="2">
                    Amount
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control value={this.state.amount} name="amount" onChange={this.handleChange} placeholder="" />
                  </Col>
                </Form.Group>
                <Button onClick={this.handleSubmit} variant="primary">Submit</Button>{' '}
              </Form>
            </Col>
          </Row>
        </Container>
      );
    }
  }
export default Transaction;  