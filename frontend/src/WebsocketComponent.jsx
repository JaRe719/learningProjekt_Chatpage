import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WebSocketComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected');
        stompClient.subscribe('/topic/notifications', (message) => {
          const notification = JSON.parse(message.body); // JSON-Daten parsen
          setNotifications((prev) => [...prev, notification]);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <h3>{notification.message}</h3>
            <p>{notification.sender}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;
