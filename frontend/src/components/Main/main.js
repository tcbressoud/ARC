import React, { Component } from 'react';
import { render } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ContentContainer from '../DefaultUI/ContentContainer/content-container';
import TutorContracts from './TutorContracts/tutor-contracts';
import TutorSessions from './TutorSessions/tutor-sessions';
import AdminSummary from './AdminSummary/admin-summary';
import AdminTutors from './AdminTutors/admin-tutors';

import css from './main.module.css';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { currentTab: 0 };

    if (this.props.auth.isAdmin)
      this.tabs = ['Summary', 'Tutors'];
    else
      this.tabs = ['Session', 'Contracts'];
  }

  onTabChange = (index) => {
    this.setState({ currentTab: index });
  }

  render() {
    return (
      <div className={css.container}>
        <div style={{ width: '100%', height: '200px', backgroundColor: '#c8032b' }}/>
        <div className={css.contentWrapper}>
          <ContentContainer tabs={this.tabs} onTabChangeCallback={this.onTabChange}
                            className={css.contentContainer} classNameContent={css.content}>
            {!this.props.auth.isAdmin && this.state.currentTab === 0 && <TutorSessions/>}
            {!this.props.auth.isAdmin && this.state.currentTab === 1 && <TutorContracts/>}

            {this.props.auth.isAdmin && this.state.currentTab === 0 && <AdminSummary/>}
            {this.props.auth.isAdmin && this.state.currentTab === 1 && <AdminTutors/>}

          </ContentContainer>
        </div>
      </div>
    );
  }
}