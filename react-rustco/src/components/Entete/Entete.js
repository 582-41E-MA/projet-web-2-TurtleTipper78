import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { useContext } from "react";
import "./Entete.css";
import { AppContext } from "../App/App";



function Entete(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLang } = useContext(AppContext);


  //icon
      let langIcon = lang == 'fr' ? 'uk' : 'france';


  return (
    <header className="justify-between">

      <div className="header-right flex items-center">

        <div className="header-logo flex items-center">
          <a href="/" className="flex items-center">
            <img src="/logo/rustcologo-ps.png" alt="Rust&Co Logo" className="logo"/>
            <span className="text-xl ml-2">Rust&Co</span>
          </a>
        </div>

        <div className="header-main-menu ml-40">
          <ul className="header-ul-main flex space-x-8">
            <li><a href="/liste-voitures">Liste des Autos</a></li>
            <li><a href="/a-propos">À Propos</a></li>
          </ul>
        </div>

      </div>

      <nav className="header-nav flex justify-between">

        <div className="header-left flex space-x-8">
          <ul className="header-ul-left flex space-x-8">
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Sign Up</a></li>
          </ul>
          {/* <LangBtn lang={lang}/> */}
          <div onClick={toggleLang} className='lang-btn w-6 hover:cursor-pointer'>
            <img src={`/icons/${langIcon}.png`} />
        </div>
        </div>

      </nav>
    </header>

  );
}

export default Entete;
