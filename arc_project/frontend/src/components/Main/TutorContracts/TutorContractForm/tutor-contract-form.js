import React, { Component } from 'react';
import { render } from 'react-dom';

import ContractMeeting from './contract-meeting'

import css from './tutor-contract-form.module.css';

export default class TutorContractForm extends Component {

  constructor(props) {
		super(props);
    this.state = {
      tutorName: '',
      tutorEmail: '',
      tutorPhone: '',
      tuteeName: '',
      tuteeEmail: '',
      tuteePhone: '',
      subject: '',
      class: '',
      instructor: '',
      meetings: [],
      tutorSig: false,
      tuteeSig: false,
    }

  }
    onSubmitHandler = (event) => {
      event.preventDefault();

    }

    onTextChangeHandler = (event) => {
      this.setState({ [event.target.name]: event.target.value });
    }
    onCheckBoxChangeHandler = (event) => {
      this.setState({ [event.target.name]: event.target.checked });
    }

    addMeeting = () => {
      let newMeetings = this.state.meetings;
      let newMeeting = { location: '',
                         day: '',
                         start: Date(),
                         end: Date(),};
      newMeetings.push(newMeeting);
      this.setState({ meetings: newMeetings });
    }
    onMeetingChangeHandler=(data)=> {
      this.state.meetings[data.index][data.name] = data.value;
      // this.forceUpdate();
    }

    render() {
      let meetings = this.state.meetings.map((meeting, index) => {
        return <ContractMeeting key={index} index={index} onChange={this.onMeetingChangeHandler}/>;
      });
  		return (
  			<div className={css.container}>
  				<h1>Make a New Contract</h1>
          <form onSubmit={this.onSubmitHandler}>

            <label>
              Tutor Name:<br/>
              <input type='text' name='tutorName' onChange={this.onTextChangeHandler}/><br/>
            </label>
            <label>
              Tutor Email:<br/>
              <input type='email' name='tutorEmail' onChange={this.onTextChangeHandler}/><br/>
            </label>
            <label>
              Tutor Phone Number:<br/>
              <input type='phone' name='tutorPhone' onChange={this.onTextChangeHandler}/><br/>
            </label>

            <br/>

            <label>
              Tutee Name:<br/>
              <input type='text' name='tuteeName' onChange={this.onTextChangeHandler}/><br/>
            </label>
            <label>
              Tutee Email:<br/>
              <input type='email' name='tuteeEmail' onChange={this.onTextChangeHandler}/><br/>
            </label>
            <label>
              Tutee Phone Number:<br/>
              <input type='phone' name='tuteePhone' onChange={this.onTextChangeHandler}/><br/>
            </label>

            <br/>

            <label>
              Subject:<br/>
              <select id = "subjects" name='subject' onChange={this.onTextChangeHandler}>
               <option value = "MATH">Math</option>
               <option value = "CS">Computer Science</option>
               <option value = "ENGL">English</option>
               <option value = "PHIL">Philosophy</option>
             </select><br/>
            </label>
            <label>
              Class:<br/>
              <input type='text' name = 'class' onChange={this.onTextChangeHandler}/><br/>
            </label>
            <label>
              Instructor:<br/>
              <input type='text' name = 'instructor' onChange={this.onTextChangeHandler}/><br/>
            </label>
            <br/>
            <h2>Add a meeting time</h2>
            {meetings}
            <button onClick={this.addMeeting}>
              Add a meeting time
            </button>

            <br/>

            <label>
              Tutor Signature
              <input type='checkbox' name='tutorSig' onChange={this.onCheckBoxChangeHandler} style={{ margin: 0 }}/><br/>
            </label>

            <label>
              Tutee Signature
              <input type='checkbox' name='tuteeSig' onChange={this.onCheckBoxChangeHandler} style={{ margin: 0 }}/><br/>
            </label>

            <input type='submit' value="Submit" onClick={this.onSubmitHandler}/>
          </form>
  			</div>
  		);
  	}
  }