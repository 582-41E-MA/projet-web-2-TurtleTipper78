import './Client.css';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContext } from "react";
import { AppContext } from "../App/App";
import { t } from 'i18next';

function Client(props){
    let { id } = useParams();
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({});

    const [comOpen, setComOpen] = useState(false);
    const [facOpen, setOpen] = useState(false);

    const urlUserInitial = `https://rustandco.onrender.com/api/utilisateurs/${id}`;

    useEffect(() => {
        async function userData(){
            try {
                const response = await fetch(urlUserInitial);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUser(data);
                setIsLoading(false);
            } catch (error) {
                setError("erreur du fetch");
                setIsLoading(false);
            }
        };
        userData();
    }, [id]);





    ///// pour reservation affichage
    // const urlListeVoitures = "https://rustandco.onrender.com/api/voitures";
    // const [listeVoitures, setListeVoitures] = useState([]);

  
    // useEffect(() => {
    //   // useEffect est juste quand il y a CHANGEMENT
    //   fetch(urlListeVoitures)
    //     .then((reponse) => reponse.json())
    //     .then((data) => {
    
    //       setListeVoitures(data);
        
    //     });
    // }, []);

    // console.log(listeVoitures)
    



    ///COMMANDES STUFF//////////////
const [com, setCom] = useState([]);
const [comVoitures, setComVoitures] = useState([]);

useEffect(() => {
    async function userData() {
        try {
            const response = await fetch(`https://rustandco.onrender.com/api/commandes`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const userCommandes = data.filter(commande => commande.utilisateur === id);
            setCom(userCommandes);

            userCommandes.forEach((commande) => {
                commande.voitures.forEach((voiture) => {
                  //  console.log(voiture); 
                });
            });

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };
    userData();
}, []); 


const listeCommandes = function() {

    return <div className="mt-10 flex flex-col items-center justify-center text-sm">
                {com.map((commande, index) => ( 
                    <ul>
                        <h4 className="text-lg font-semibold mb-4">{t('commande')} {index+1}</h4>
                        <li key={index} className="mb-4 p-2 bg-white_1 rounded-2xl">
                            <div className="flex items-center space-x-4 justify-between px-6">
                                <ul className='flex flex-col gap-2'>
                                    <li><strong>{t('utilisateur_id')}:</strong>{commande.utilisateur}</li>
                                    <li><strong>{t('id')}:</strong>{commande.id}</li>
                                    <li><strong>Date: </strong>{commande.date}</li>
                                    <li><strong>{t('expedition')}:</strong> {commande.expedition}</li>
                                    <li><strong>{t('methode_de_paiment')}: </strong>{commande.methode_de_paiement}</li>
                                    <li><strong>{t('status')}: </strong>{commande.status}</li>
                                    <li><strong>Taxes: </strong>{commande.taxes}</li>
                                    <li><strong>Total:</strong> {commande.total} $</li>
                                    <li><strong>{t('autos_menu')}:</strong> 
                                        <ul className='ml-6'>
                                            {commande.voitures.map((voiture, vIndex) => (
                                                <li key={vIndex}><u>{t('voiture')}</u> {vIndex+1}: {voiture.id}</li>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </li> 
                    </ul>
                ))}
            </div>
}


const [factures, setFactures] = useState([]);
useEffect(() => {
    async function userData() {
        try {
            const response = await fetch(`https://rustandco.onrender.com/api/factures`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const userFactures = data.filter(facture => facture.utilisateur === user.id);
            setFactures(userFactures);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };
    userData();
}, []);

console.log(factures);


const listeFactures = function() {

   return   <div className="mt-10 flex flex-col items-center justify-center text-sm">
                {com.map((facture, index) => ( 
                    <ul  className="bg-white shadow-lg  p-6 mb-4 w-full max-w-4xl">
                        <h4 className="text-lg font-semibold mb-4">{t('facture')} {index+1}</h4>
                        <li key={index} className="mb-4 p-2 bg-white_1 rounded-2xl">
                            <div className="border-t border-gray-200 pt-2">
                                <ul className='flex flex-col gap-2'>
                                    <li><strong>{t('utilisateur_id')}:</strong>{facture.utilisateur}</li>
                                    <li><strong>{t('id')}:</strong>{facture.id}</li>
                                    <li><strong>Date: </strong>{facture.date}</li>
                                    <li><strong>{t('expedition')}:</strong> {facture.expedition}</li>
                                    <li><strong>{t('methode_de_paiment')}: </strong>{facture.methode_de_paiement}</li>
                                    <li><strong>{t('status')}: </strong>{facture.status}</li>
                                    <li><strong>Taxes: </strong>{facture.taxes}</li>
                                    <li><strong>Total:</strong> {facture.total} $</li>
                                    <li className='mb-2'><strong>{t('autos_menu')}:</strong> 
                                        <ul className='ml-6 list-disc'>
                                            {facture.voitures.map((voiture, vIndex) => (
                                                <li key={vIndex}><u>{t('voiture')}</u> {vIndex+1}: {voiture.id}</li>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </li> 
                    </ul>
                ))}
            </div>
}


// toggle visibility 
const [commandeVisible, setCommandeVisible] = useState(false);
const [factureVisible, setFactureVisible] = useState(false);

const toggleCommandes = () => {
    setCommandeVisible(!commandeVisible);  
  };  
  
const toggleFactures = () => {
    setFactureVisible(!factureVisible);  
}



    return(
        <div className='tout-tout-container'>
            <h1 className='text-3xl font-bold mb-6'>Ma Page Client</h1>
            <div className='grid md:grid-cols-1 lg:grid-cols-2 gap-4 min-w-[40vw]'>
                <div className='info-user col-span-1 border rounded-2xl p-6 min-h-[500px] bg-sand_1'>
                    <h2 className='text-2xl font-bold mb-6'>{t('infos_perso')}</h2>
                    <ul className="user-details mb-6">
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>{t('adresse')} :</strong> {user.adresse}</li>
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>{t('anniversaire')} :</strong> {user.anniversaire}</li>
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>{t('code_postal')} :</strong> {user.code_postal}</li>
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>{t('courriel')} :</strong> {user.courriel}</li>
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>{t('id')} :</strong> {user.id}</li>
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>{t('nom_de_famille')} :</strong> {user.nom_de_famille}</li>
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>{t('prenom')} :</strong> {user.prenom}</li>
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>{t('privilège')} :</strong> {user.privilege}</li>
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>Province :</strong> {user.province}</li>
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>{t('telephone')} :</strong> {user.telephone}</li>
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>{t('utilisateur')} :</strong> {user.username}</li>
                        <li className='bg-white_1 px-2 py-1 rounded-lg mb-1'><strong>{t('ville')} :</strong> {user.ville}</li>
                    </ul>
                    <div className='edit-btn-container'>
                        <Link to={`/update-user/${user.id}`}>
                            <button className='custom-button'>{t('modifier')}</button>
                        </Link>
                    </div>
                </div>
                <div className='info-commandes col-span-1 border rounded-2xl bg-sand_1 p-6 min-h-[500px]'>
                    <h2 className='text-2xl font-bold mb-6'>{t('mes_commandes')}</h2>
                    <h3 onClick={toggleCommandes} style={{ cursor: 'pointer' }} className='text-blue_4 font-bold'>- {!commandeVisible ? t('voir_commandes') : t('cacher_commandes') }</h3>
                    <div className={commandeVisible ? '' : 'hidden'}>
                        {listeCommandes()}
                    </div>
                </div>
                <div className='info-commandes col-span-1 border rounded-2xl bg-sand_1 p-6 min-h-[500px]'>
                    <h2 className='text-2xl font-bold mb-6'>{t('mes_factures')}</h2>
                    <h3 onClick={toggleFactures} style={{ cursor: 'pointer' }} className='text-blue_4 font-bold'>- {!factureVisible ? t('voir_factures') : t('cacher_factures') }</h3>
                    <div className={factureVisible ? '' : 'hidden'}>
                        {listeFactures()}
                    </div>
                </div>
                <div className='info-commandes col-span-1 border rounded-2xl bg-sand_1 p-6 min-h-[500px]'>
                    <h2 className='text-2xl font-bold mb-6'>{t('mes_reservations')}</h2>
                    {/* Reservations details here */}
                </div>
            </div>
        </div>
    )
}

export default Client;