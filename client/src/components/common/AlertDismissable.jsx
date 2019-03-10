import React, { Component } from 'react'
import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class Notification extends Component {
  createNotification = (type, message, title) => {
    return () => {
      switch (type) {
        case 'info':
          NotificationManager.info(message, title)
          break
        case 'success':
          NotificationManager.success(message, title)
          break
        case 'warning':
          NotificationManager.warning(message, title, 3000)
          break
        case 'error':
          NotificationManager.error(message, title, 5000)
          break
        default :
          break
      }
    }
  }

  componentWillMount() {
    const { type, message, title } = this.props
    this.createNotification(type, message, title)
  }

  render() {
      return (
      <div>
        <NotificationContainer/>
      </div>
    );
  }
}

export default Notification;