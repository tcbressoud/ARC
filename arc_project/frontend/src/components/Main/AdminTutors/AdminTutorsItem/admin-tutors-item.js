import React, { Component } from 'react';
import { render } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext } from '../../../Auth/auth'

import Modal from '../../../DefaultUI/Modal/modal';
import TutorContractItem from './TutorContractItem/tutor-contract-item';
import MyAPI from '../../../Api';

import css from './admin-tutors-item.module.css';
import cssSession from '../../TutorSessions/TutorSessionItem/tutor-session-item.module.css';

export default class AdminTutorsItem extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = { showModal: false,
                   data: [],
                   tutor_id : this.props.tutor.id,
                   tutor_first_name: this.props.tutor.first_name,
                   tutor_last_name: this.props.tutor.last_name,
                   tutor_phone: this.props.tutor.phone,
                   tutor_email: this.props.tutor.email,};
  }

  componentDidMount() {
		// Get all the contract of this user, then put it
		// into this.state.data. Check MyAPI class for more
		// functionality
		MyAPI.get_contract(null, this.context.access_token)
		.then((response) => {
			//TODO: check for error response here
			return response.json();
		})
		.then((data) => {
			//set this.state.data
			this.setState({
				data: data.results,
			});
		});
    MyAPI.get_userprofile(this.props.index, {'is_tutor': true}, this.context.access_token)
    .then((response) => {
        return response.json();
    }).then((data) => {
        this.setState({
            tutorData: data.results,
        });
    });
  }

  toggleModal = () => {
    this.setState((prevState) => {
      return { ...prevState, showModal: !prevState.showModal };
    });
  }

  render() {
    var tutor_first_name = this.state.tutor_first_name;
    var tutor_last_name = this.state.tutor_last_name;
    var tutor_email = this.state.tutor_email;
    var tutor_phone = this.state.tutor_phone;
		// Pass the contract data from this.state.data to the TutorContractItem
		// child, the data can be accessed through this.props.contract in
		// TutorContractItem
    let contracts = this.state.data.map((contract, index) => {
			return(
				<TutorContractItem key={index} contract={contract}/>
			);
		});

    return (
      <div className={css.container}>
      Name: {tutor_first_name} {tutor_last_name}<br/>
      Email: {tutor_email}<br/>
      Phone: {tutor_phone}<br/>
        <div className={cssSession.list}>
  			  {contracts}
        </div>
      </div>
    );
  }
}
