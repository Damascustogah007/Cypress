export default {
  routes_shop: {
    checkout: {
      de: '/bestellung',
      fr: '/ordre',
    },
    new_password_not_logged_in: {
      de: '/passwort-aendern',
      fr: '/modifier-mot-passe',
    },
    register: {
      de: '/neues-konto',
      fr: '/nouveau-compte',
    },
    search: {
      de: '/suche',
      fr: '/recherche',
    },
    advancedSearch: {
      de: '/erweiterte-suche',
      fr: '/recherche-detaillee',
    },
    stores: {
      de: '/ueber-uns/filialen',
      fr: '/ex-libris-sa/succursales',
    },
    passwordForgot: {
      de: '/mein-konto/passwort-vergessen',
      fr: '/mon-compte/passwort-vergessen',
    },
    passwordForgotApp: {
      de: '/login/passwort-vergessen',
      fr: '/login/passwort-vergessen',
    },
    login: {
      de: '/mein-konto/login',
      fr: '/mon-compte/identification',
    },
    loginApp: {
      de: '/login',
      fr: '/identification',
    },
    myAccount: {
      de: '/mein-konto',
      fr: '/mon-compte',
    },
    myAccountOpenOrders: {
      de: '/mein-konto/offene-bestellungen',
      fr: '/mein-konto/offene-bestellungen',
    },
    orders: {
      de: '/mein-konto/meine-bestellungen/',
      fr: '/mon-compte/mes-commandes/',
    },
    orders_change_delivery_address: {
      de: '/mein-konto/bestellungen/lieferadresse-aendern',
      fr: '/mon-compte/commandes/modifier-adresse-livraison',
    },
    orders_cancel: {
      de: '/mein-konto/storno-bestellung',
      fr: '/mon-compte/annulation-commande',
    },
    orders_return: {
      de: '/mein-konto/retournieren-bestellung',
      fr: '/mon-compte/renvoyer-commande',
    },
    my_ebooks: {
      de: '/mein-konto/redownload-ebook',
      fr: '/mon-compte/re-telechargement-ebook',
    },
    club: {
      de: '/club-welt',
    },
    mitgliedschaft_beantragen: {
      de: '/club-mitglied/mitgliedschaft-beantragen/',
    },
    club_membership: {
      de: '/mein-konto/mitgliedschaft/',
    },
    club_account_address: {
      de: '/mein-konto/adresse/',
      fr: '/mon-compte/adresse/',
    },
    club_mitgliedschaft_hinterlegen: {
      de: '/club-mitglied/club-kartennummer-hinterlegen/',
    },
    club_meine_rabatt_bons: {
      de: '/club_mitglied/rabatt-bons/',
    },
    club_new_account: {
      de: '/club_mitglied/neues-konto/',
    },
    club_new_account_with_card: {
      de: '/club_mitglied/konto-erstellen/club_angaben/',
    },
    club_konto_rabatt_bons: {
      de: '/mein-konto/rabatt-bons/',
    },
    club_karte: {
      de: '/club_mitglied/karte/',
    },
    club_kontakt: {
      de: '/club_informationen/kontakt-hilfe/',
    },
    club_adresse: {
      de: '/club_mitglied/adresse/',
    },
    logoutApp: {
      de: '/abmelden',
      fr: '/deconnexion',
    },
    newsletter: {
      de: '/ueber-uns/newsletter/anmeldung',
      fr: '/ex-libris-sa/newsletter/inscription',
    },
    product: {
      de: '/:products*/id/:productId',
      fr: '/:products*/id/:productId',
    },
    product_category: {
      de: '/produkt-kategorie',
      fr: '/product-category',
    },
    club_dummy: {
      de: '/club_dummy',
      fr: '/club_dummy',
    },
    basket: {
      de: '/de/bestellung/warenkorb/',
      fr: '/fr/ordre/panier/',
    },
    checkout_login: {
      de: '/de/bestellung/login/',
      fr: '/fr/ordre/login/',
    },
    checkout_step2_logged_in: {
      de: '/de/bestellung/adresse/?step=2',
      fr: '/fr/ordre/adresse/?step=2',
    },
    checkout_step2_ChangeDeliveryAddress: {
      de: '/de/bestellung/zahlung/lieferadresse-aendern/?step=2',
      fr: '/fr/ordre/paiement/modifier-adresse-facturation/?step=2',
    },
    checkout_step2_BillAddress: {
      de: '/de/bestellung/zahlung/rechnungsadresse-aendern/?step=2',
      fr: '/fr/ordre/paiement/modifier-adresse-livraison/?step=2',
    },
    checkout_step2_NewAccount: {
      // fix 'rt' is needed here for 'checkout login' page
      de: '/de/bestellung/adresse/neues-konto/?step=1&rt=n',
      // fix 'rt' is needed here for 'checkout login' page
      fr: '/fr/ordre/adresse/nouveau-compte/?step=1&rt=n',
    },
    checkout_step2_NewAccountGuest: {
      // fix 'rt' is needed here for 'checkout login' page
      de: '/de/bestellung/adresse/ohne-registrierung/?step=1&rt=g',
      // fix 'rt' is needed here for 'checkout login' page
      fr: '/fr/ordre/adresse/sans-identification/?step=1&rt=g',
    },
    checkout_step2_payment: {
      de: '/de/bestellung/zahlung/?step=3',
      fr: '/fr/ordre/paiement/?step=3',
    },
    checkout_step2_confirmation: {
      de: '/de/bestellung/quittung/?step=4',
      fr: '/fr/ordre/recu/?step=4',
    },
  },
}
