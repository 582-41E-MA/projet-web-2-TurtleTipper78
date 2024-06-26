import { useState, useEffect } from "react";
import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Entete from "../Entete/Entete";
import './Login.css';
import { t } from 'i18next'
import CustomAlert from "../CustomAlert/CustomAlert";


function Login(props) {


  return (
    <div className="block">
      <div className="flex flex-col items-center">
        <div className="rounded-2xl overflow-hidden p-6 custom-shadow bg-sand_2">
          <h1 className="text-xl font-bold">{t('connexion_menu')}</h1>

          <form onSubmit={props.handleLogin} className="form-login">
            <input type="text" name="courriel" placeholder="Usager"></input>
            <input type="password" name="mdp" placeholder="mot de passe"></input>
            <button className="custom-button">{t('connexion')}</button>
          </form>
        </div>
        <p className="align-center mt-8">
        {t('login_page')} <a className="text-blue-500 font-bold text-xl" href="/create-user">{t('ici')}</a>.
        </p>
      </div>
    </div>

  );
}

export default Login;
