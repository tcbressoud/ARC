import React, { Component } from 'react';
import { render } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext } from '../../../Auth/auth'

import Modal from '../../../DefaultUI/Modal/modal';
import MyAPI from '../../../Api';
import Collapsible from '../../../DefaultUI/Collapsible/collapsible';
import AdminTutorsItemDetails from './AdminTutorsItemDetails/admin-tutors-item-details';


import css from './admin-tutors-item.module.css';
import cssSession from '../../TutorSessions/TutorSessionItem/tutor-session-item.module.css';

//Component should be passed key, which is index of this user,
//and the tutor profile from the API
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
		// Get all the contracts of this user, then put it
		// into this.state.data. Check MyAPI class for more
		// functionality
		MyAPI.get_contract(this.key, this.context.access_token)
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
  }

  toggleModal = () => {
    this.setState((prevState) => {
      return { ...prevState, showModal: !prevState.showModal };
    });
  }

  render() {
    var tutor_id = this.state.tutor_id;
    var tutor_first_name = this.state.tutor_first_name;
    var tutor_last_name = this.state.tutor_last_name;
    var tutor_email = this.state.tutor_email;
    var tutor_phone = this.state.tutor_phone;
    var tutor = {}
    let mainInfo = (
      <>
      <tr key={tutor_id}>
         <td>{tutor_first_name}</td>
         <td>{tutor_last_name}</td>
         <td>{tutor_email}</td>
         <td>{tutor_phone}</td>
         <td>
         <div className={cssSession.buttonWrapper}>
           <span className={cssSession.addButton} onClick={this.toggleModal}>
              View Details
           </span>
         </div>
         <Modal isVisible={this.state.showModal} toggle={this.toggleModal} title={'View Details'}>
           <AuthContext.Consumer>
               {value => <AdminTutorsItemDetails auth={value} key={this.index} tutor={this.state}/>}

           </AuthContext.Consumer>
         </Modal>
         </td>
      </tr>
      </>
    );


    return (
      mainInfo
    );
  }
}
