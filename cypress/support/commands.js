// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';

// Development firebase config copied from firebaseConfig.ts
const fbConfig = {
  apiKey: 'AIzaSyAfePy1Tbrqm55bYR7BHHl50r-9NTVj0Rs',
  authDomain: 'cornelldti-courseplan-dev.firebaseapp.com',
  databaseURL: 'https://cornelldti-courseplan-dev.firebaseio.com',
  projectId: 'cornelldti-courseplan-dev',
  storageBucket: '',
  messagingSenderId: '321304703190',
  appId: '1:321304703190:web:2f2fefb4a0284465b99977',
};

firebase.initializeApp(fbConfig);

// attach custom firebase commands to cypress from the cypress-firebase package
attachCustomCommands({ Cypress, cy, firebase });
