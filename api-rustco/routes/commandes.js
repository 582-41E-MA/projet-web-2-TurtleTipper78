const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const authAdmin = require("../middlewares/authAdmin.js");
const authEmploye = require("../middlewares/authEmploye.js");
const { check, validationResult } = require("express-validator");

/**
 * PREND TOUTE LES COMMANDES
 * Cette route permet de récupérer la liste des commandes
 * @route GET 
 */
router.get("/", async (req, res) => {

    try{

        const donneesCommandes = await db.collection("commandes").get();
        const donneesFinale = [];

        donneesCommandes.forEach((doc)=>{
            donneesFinale.push(doc.data());
        })

        res.statusCode = 200;
        res.json(donneesFinale);

    
    } catch (erreur){
        console.log(erreur)
        res.statusCode = 500;
        res.json({message: "Une erreur est survenue."})
    }
});

//-------------------------------------------------------------------------------------

/**
 * PREND UNE COMMANDE AVEC SON ID
 * Cette route permet de récupérer une commande
 * @route GET
 */
router.get("/:id", async (req, res) => {
    try{
        const idCommande = req.params.id;

        const donneeRef = await db.collection("commandes").doc(idCommande).get();

        const donnee = donneeRef.data();

        if (donnee) {
            res.statusCode = 200;
            res.json(donnee);
        } else {
            res.statusCode = 500;
            res.json({ message: "Commande non trouvé" });
        }

    }catch (error){
        res.statusCode = 500;
        res.json({ message: "Commande non trouvé" });
    }
    
});

//-------------------------------------------------------------------------------------

/**
 * CRÉATION
 * Cette route permet de créer un film
 * @route POST /films
 */
//TODO:Validation de Conditions_id
router.post("/",
    [
        check("expedition").escape().trim().notEmpty().isString(),
        check("methode_de_paiement").escape().trim().notEmpty().isString(),
        check("total").escape().trim().notEmpty().isNumeric(),
        check("status").escape().trim().notEmpty().isString(),
        check("taxes").escape().trim().notEmpty().isString(),
        check("utilisateur").escape().trim().notEmpty().isString(),
        check("voitures").notEmpty().isArray()
    ],
    
    async (req, res) => {

        const validation = validationResult(req);

        if (validation.errors.length > 0) {
            res.statusCode = 400;
            return res.json({message: "Données non comforme"})
        }


        //VALIDATION EXISTENCE DANS LA DB

        //EXPÉDITIONS
        //---------------------------------------------------------------------------------------------------
        const docRefExpedition = await db.collection("expeditions").where("type", "==", req.body.expedition).get();
        const expeditions = [];

        docRefExpedition.forEach((doc)=>{
            expeditions.push(doc.data());
        })

        //Si oui, erreur
        if (expeditions.length <= 0) {
            res.statusCode = 400;
            return res.json({message: "La méthode d'expédition n'éxiste pas"});
        }
        //---------------------------------------------------------------------------------------------------

        //MÉTHODES DE PAIEMENT
        //---------------------------------------------------------------------------------------------------
        const docRefMethode = await db.collection("methodes").where("methode", "==", req.body.methode_de_paiement).get();
        const methodes = [];

        docRefMethode.forEach((doc)=>{
            methodes.push(doc.data());
        })

        //Si oui, erreur
        if (methodes.length <= 0) {
            res.statusCode = 400;
            return res.json({message: "La méthode de paiement n'éxiste pas"});
        }
        //---------------------------------------------------------------------------------------------------

        //TAXES
        //---------------------------------------------------------------------------------------------------
        const docRefTaxes = await db.collection("taxes").where("taxe", "==", req.body.taxes).get();
        const taxes = [];

        docRefTaxes.forEach((doc)=>{
            taxes.push(doc.data());
        })

        //Si oui, erreur
        if (methodes.length <= 0) {
            res.statusCode = 400;
            return res.json({message: "La/Les taxe n'éxiste pas"});
        }
        //---------------------------------------------------------------------------------------------------
        
        //STATUS
        //---------------------------------------------------------------------------------------------------
        const docRefStatus = await db.collection("status").where("status", "==", req.body.status).get();
        const status = [];

        docRefStatus.forEach((doc)=>{
            status.push(doc.data());
        })

        //Si oui, erreur
        if (methodes.length <= 0) {
            res.statusCode = 400;
            return res.json({message: "Le status n'éxiste pas"});
        }
        //---------------------------------------------------------------------------------------------------


        //Génère date d'aujourd'hui
        const dateMilisecondes = Date.now()

        const date_time = new Date(dateMilisecondes);
        const date = date_time.getDate();
        const month = date_time.getMonth() + 1;
        const year = date_time.getFullYear();

        const dateToday = year + "-" + month + "-" + date

        try{

            //Créer un champ de valeur dans firebase. (Ceci éxiste pour créer un champ avec un ID et récupérer son id pour la vrai valeur)
            let createField = {};
            await db.collection("commandes").add(createField)


            /**
             * Ajout des vraies données en modifiant le champ vide créer
             */
            .then(async function(docRef) {

                const commande = {};
                commande.id = docRef.id;
                commande.date = dateToday;
                commande.expedition = req.body.expedition;
                commande.methode_de_paiement = req.body.methode_de_paiement;
                commande.total = req.body.total;
                commande.status = req.body.status;
                commande.taxes = req.body.taxes;
                commande.voitures = req.body.voitures
                commande.utilisateur = req.body.utilisateur;

                await db.collection("commandes").doc(docRef.id).update(commande);

            })        

            res.statusCode = 201;
            res.json({message: "La donnée a été ajoutée"});
        } catch {
            res.statusCode = 500;
            res.json({message: "error"})
        }
    }
);

//-------------------------------------------------------------------------------------

/**
 * MODIFICATION
 * Cette route permet de modifier un utilisateur
 * @route POST 
 */
router.put("/:id", 
    [
        check("date").escape().trim().notEmpty().matches(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/),
        check("expedition").escape().trim().notEmpty().isString(),
        check("methode_de_paiement").escape().trim().notEmpty().isString(),
        check("total").escape().trim().notEmpty().isNumeric(),
        check("status").escape().trim().notEmpty().isString(),
        check("taxes").escape().trim().notEmpty().isString(),
        check("utilisateur").escape().trim().notEmpty().isString(),
        check("voitures").notEmpty().isArray()
    ],
    
    async (req, res) => {

        const validation = validationResult(req);       

        if (validation.errors.length > 0) {
            res.statusCode = 400;
            return res.json({message: "Données non comforme"})
        }


        //VALIDATION EXISTENCE DANS LA DB

        //EXPÉDITIONS
        //---------------------------------------------------------------------------------------------------
        const docRefExpedition = await db.collection("expeditions").where("expedition", "==", req.body.expedition).get();
        const provinces = [];

        docRefExpedition.forEach((doc)=>{
            expeditions.push(doc.data());
        })

        //Si oui, erreur
        if (expeditions.length <= 0) {
            res.statusCode = 400;
            return res.json({message: "La méthode d'expédition n'éxiste pas"});
        }
        //---------------------------------------------------------------------------------------------------

        //MÉTHODES DE PAIEMENT
        //---------------------------------------------------------------------------------------------------
        const docRefMethode = await db.collection("methodes").where("methode", "==", req.body.methode_de_paiement).get();
        const methodes = [];

        docRefMethode.forEach((doc)=>{
            methodes.push(doc.data());
        })

        //Si oui, erreur
        if (methodes.length <= 0) {
            res.statusCode = 400;
            return res.json({message: "La méthode de paiement n'éxiste pas"});
        }
        //---------------------------------------------------------------------------------------------------

        //TAXES
        //---------------------------------------------------------------------------------------------------
        const docRefTaxes = await db.collection("taxes").where("taxe", "==", req.body.taxes).get();
        const taxes = [];

        docRefTaxes.forEach((doc)=>{
            taxes.push(doc.data());
        })

        //Si oui, erreur
        if (methodes.length <= 0) {
            res.statusCode = 400;
            return res.json({message: "La/Les taxe n'éxiste pas"});
        }
        //---------------------------------------------------------------------------------------------------

        //STATUS
        //---------------------------------------------------------------------------------------------------
        const docRefStatus = await db.collection("status").where("status", "==", req.body.status).get();
        const status = [];

        docRefStatus.forEach((doc)=>{
            status.push(doc.data());
        })

        //Si oui, erreur
        if (methodes.length <= 0) {
            res.statusCode = 400;
            return res.json({message: "Le status n'éxiste pas"});
        }
        //---------------------------------------------------------------------------------------------------

        try{
            const idCommande = req.params.id;
            const commande = {};
            commande.id = docRef.id;
            commande.date = req.body.date;
            commande.expedition = req.body.expedition;
            commande.methode_de_paiement = req.body.methode_de_paiement;
            commande.total = req.body.total;
            commande.status = req.body.status;
            commande.taxes = req.body.taxes;
            commande.utilisateur = req.body.utilisateur;

            await db.collection("commandes").doc(idCommande).update(commande);

            res.statusCode = 201;
            res.json({message: "La donnée a été modifiée"});
        } catch {
            res.statusCode = 500;
            res.json({message: "error"})
        }
    }
);

//-------------------------------------------------------------------------------------

//SUPPRIMER
router.delete("/:id", async (req, res)=>{
    //params est tout les : dans ton url. Par exemple, :id, :user etc
    const idCommande = req.params.id;
    const resultat = await db.collection("commandes").doc(idCommande).delete();

    res.json("La donnée a été supprimé");
});

//-------------------------------------------------------------------------------------


module.exports = router;