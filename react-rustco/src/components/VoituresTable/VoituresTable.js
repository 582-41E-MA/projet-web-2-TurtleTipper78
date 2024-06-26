import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { t } from "i18next"
import modelesParMarque from '../../modelesParMarque.json';
import './VoituresTable.css'

function VoituresTable(){

    const urlListeVoitures = "https://rustandco.onrender.com/api/voitures";
    const [listeVoitures, setListeVoitures] = useState([]);
    const [voiture, setVoiture] = useState({});
    const [modeles, setModeles] = useState([]);
    const [marqueSelectionnee, setMarqueSelectionnee] = useState('');


    const anneeCourrante = new Date().getFullYear();
    const annees = Array.from({ length: (anneeCourrante - 1920) + 1 }, (_, index) => anneeCourrante - index);


    useEffect(() => {
        // useEffect est juste quand il y a CHANGEMENT
        fetch(urlListeVoitures)
          .then((reponse) => reponse.json())
          .then((data) => {
            setListeVoitures(data)
          });
      }, []);
    

    /// DELETE
    function deleteVoiture(id){
        const bonId = id.trim();
        fetch(`${urlListeVoitures}/${bonId}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${localStorage.getItem('logged-user')}`
            },
        })
        .then((reponse) => {
            if (reponse.ok) { 
                setListeVoitures(listeVoitures.filter(voiture => voiture.id !== id));
            } 
        })
        .catch((error) => {
            console.error('Erreur:', error);
        });
    };



    //------------------------------------------------------------------//


    const handleChange = (e) => {
        handleMarqueChange(e);
  
    };

                /////////////////////////////// FILTRES //////////////////////////////
                useEffect(() => {
                
                    setModeles(modelesParMarque[voiture.modele]);
                 
                }, [marqueSelectionnee]);
                
                const handleMarqueChange = (e) => {
                    setMarqueSelectionnee(e.target.value);
                };
                
                const capitalizeFirst = (string) => {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                };
                ///////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////
  const liVoiture = listeVoitures.map((voiture, index) => {
   // console.log(voiture);
    return (
       <tr key={index}>
        <td data-label="Id">
            {voiture.id}
        </td>
        <td  data-label="Marque">
            {voiture.marque}
        </td>
        <td data-label="Modèle">
            {voiture.modele}
        </td>
        <td data-label="Année">
            {voiture.annee}
        </td>
        <td data-label="Condition">
            {voiture.condition}
        </td>
        <td data-label="Prix Acheté">
            {voiture.prix_achete}
        </td>
        <td data-label="Profit">
            {voiture.profit}
        </td>
        <td  data-label="Actions" className="flex border-none justify-around">
            <Link to={`/update-voiture/${voiture.id.trim()}`}> 
                <img className="w-8 mx-2 cursor-pointer" src="/icons/edit.png" />
            </Link> 
            <img className="w-8 mx-2 cursor-pointer" src="/icons/delete.png" onClick={(e) => { e.preventDefault(); deleteVoiture(voiture.id);}}></img>
        </td>
      </tr> 
    ); 
  });

    return (
        <div>
            <a href="/create-voiture"><button className="custom-button mt-5">+ {t('ajout_voiture')}</button></a>

            <table className="voitures-table mt-5">
                <thead>
                    <tr>
                        <th>{t('id')}</th>
                        <th>{t('marque')}</th>
                        <th>{t('modele')}</th>
                        <th>{t('Année')}</th>
                        <th>{t('condition')}</th>
                        <th>{t('prix_a_lachat')}</th>
                        <th>{t('marge_de_profit')}(%)</th>
                        <th>Opérations</th>
                    </tr>
                </thead>
                <tbody>
                    {liVoiture}
                </tbody>  
            </table>


        </div>
        
    )

}

export default VoituresTable;