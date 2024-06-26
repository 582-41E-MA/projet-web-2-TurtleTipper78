import './CommandesTable.css'
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { t } from "i18next";


function CommandesTable(props){

     const urlListeCommandes = "https://rustandco.onrender.com/api/commandes";
     const [listeCommandes, setListeCommandes] = useState([]);
     const estEmploye = props.userType == 'employe';
     const [createUser, setCreateUser] = useState(false);

     

    useEffect(() => {
        // useEffect est juste quand il y a CHANGEMENT
        fetch(urlListeCommandes)
          .then((reponse) => reponse.json())
          .then((data) => {
            setListeCommandes(data);
            setCreateUser(false);
          });
      }, []);
      

     /// DELETE
    function deleteCommande(id){

        const bonId = id.trim();

        fetch(`${urlListeCommandes}/${bonId}`, {
            method: 'DELETE',
        })
        .then((reponse) => {
            if (reponse.ok) { 
                setListeCommandes(listeCommandes.filter(commande => commande.id !== id));
            } 
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
    };


console.log(listeCommandes)

  /*commandes data pour table*/
  const liCommandes = listeCommandes.map((commande, index) => {
    return (
       <tr key={index}>
        <td>
            {commande.id}
        </td>
            <ul >
                {commande.voitures.map((voiture, idx) => (
                    <li key={idx}> <b>- </b> {voiture.id}</li>
                ))}
            </ul>
       
        <td>
            {commande.date}
        </td>
        <td>
            {commande.expedition}
        </td>
        <td>
            {commande.methode_de_paiement}
        </td>
        <td>
            {commande.status}
        </td>
        <td>
            {commande.taxes}
        </td>
        <td>
            {commande.total}
        </td>
        <td>
            {commande.utilisateur}
        </td>
       
        <td className="flex border-none justify-around min-w-max">
            <img className="w-8 mx-2 cursor-pointer" src="/icons/delete.png" onClick={(e) => { e.preventDefault(); deleteCommande(commande.id); }}></img>
        </td>
      </tr> 
    ); 
  });

    return (
      
            <div>
                <table className="commandes-table mt-5">
                    <thead>
                        <tr>
                            <th>{t('id')}</th>
                            <th>{t('voiture')}s</th>
                            <th>Date</th>
                            <th>{t('expedition')}</th>
                            <th>{t('methode_de_paiment')}</th>
                            <th>Status</th>
                            <th>Taxes</th>
                            <th>Total</th>
                            <th>{t('utilisateur_id')}</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {liCommandes}
                    </tbody>  
                </table> 
            </div>
        
    );
}

export default CommandesTable;