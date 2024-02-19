import React from 'react';
import { Link } from 'react-router-dom';

const About = () => (
  <div>
    <p>
      <b>☀️ React app inside a sidebar ohiaaa! ☀️</b>
    </p>
    <p>
      This is a very simple page demonstrating how to build a React app inside a
      sidebar.
    </p>
    <p>
      Visit the Github repo for more information on how to use this project.
    </p>
    <p>- Elisha Nuchi</p>
    <Link
      to="contacts"
    >
      React + Google Apps Script
    </Link>
  </div>
);

export default About;
