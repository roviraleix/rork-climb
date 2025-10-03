export type Language = "en" | "es" | "ca" | "fr" | "de";

export const translations = {
  en: {
    // App name
    appName: "La Fusteria",
    
    // Navigation
    create: "Create",
    routes: "Routes",
    settings: "Settings",
    
    // Create screen
    connectBoard: "Connect Board",
    disconnect: "Disconnect",
    clearAll: "Clear All",
    saveRoute: "Save Route",
    ledColor: "LED Color",
    climbingWall: "Climbing Wall",
    selectedColor: "Selected Color",
    tapHoldsToToggle: "Tap holds to toggle LEDs",
    holdsSelected: "holds selected",
    
    // Color labels
    top: "Top",
    feet: "Feet", 
    hands: "Hands",
    start: "Start",
    
    // Save route modal
    routeName: "Route Name",
    enterRouteName: "Enter route name",
    setter: "Setter",
    enterSetterName: "Enter setter name",
    gradeDifficulty: "Grade/Difficulty",
    type: "Type",
    boulder: "Boulder",
    route: "Route",
    cancel: "Cancel",
    save: "Save",
    
    // Routes screen
    savedRoutes: "Saved Routes",
    noRoutesYet: "No Routes Yet",
    createFirstRoute: "Create your first climbing route in the Create tab",
    of: "of",
    routesCount: "routes",
    filtered: "(filtered)",
    noRoutesMatchFilters: "No Routes Match Filters",
    tryAdjustingFilters: "Try adjusting your filters or clear them to see all routes",
    clearFilters: "Clear Filters",
    filterRoutes: "Filter Routes",
    allTypes: "All Types",
    allGrades: "All Grades",
    clear: "Clear",
    
    // Settings screen
    connection: "Connection",
    connectToBoard: "Connect to Board",
    disconnectBoard: "Disconnect Board",
    currentlyConnected: "Currently connected",
    tapToConnect: "Tap to connect",
    wallConfiguration: "Wall Configuration",
    matrixSize: "Matrix Size",
    current: "Current",
    dataManagement: "Data Management",
    clearAllRoutes: "Clear All Routes",
    deleteAllSavedRoutes: "Delete all saved climbing routes",
    about: "About",
    version: "Version",
    appDescription: "Create and manage climbing routes with LED-enhanced training walls. Connect to board devices to control LED matrices for interactive route visualization.",
    ledColors: "LED Colors",
    redTopFinish: "Red - Top/Finish Holds",
    orangeFoot: "Orange - Foot Holds", 
    blueHand: "Blue - Hand Holds",
    greenStart: "Green - Start Holds",
    gradeSystem: "Grade System",
    language: "Language",
    
    // Grade systems
    french: "French",
    yds: "YDS (American)",
    uiaa: "UIAA",
    british: "British",
    "v-scale": "V-Scale (Boulder)",
    
    // Languages
    english: "English",
    spanish: "Spanish", 
    catalan: "Catalan",
    frenchLang: "French",
    german: "German",
    
    // Alerts and messages
    success: "Success",
    error: "Error",
    notConnected: "Not Connected",
    pleaseConnectFirst: "Please connect to board first",
    routeSavedSuccessfully: "Route saved successfully!",
    pleaseEnterRouteName: "Please enter a route name",
    pleaseEnterSetterName: "Please enter the setter name",
    pleaseEnterValidGrade: "Please enter a valid grade",
    pleaseSelectAtLeastOneHold: "Please select at least one hold",
    deleteRoute: "Delete Route",
    areYouSureDelete: "Are you sure you want to delete",
    delete: "Delete",
    connectedToBoard: "Connected to board",
    disconnectedFromBoard: "Disconnected from board",
    allLedsOff: "All LEDs turned off",
    failedToClearLeds: "Failed to clear LEDs",
    routeDisplayedOnWall: "is now displayed on the wall",
    failedToLoadRoute: "Failed to load route",
    allRoutesDeleted: "All routes have been deleted",
    ok: "OK",
    
    // Matrix configuration
    adjustMatrixSize: "Adjust the size of your climbing wall matrix. This will affect how the holds are displayed in the app.",
    rows: "Rows",
    columns: "Columns",
    preview: "Preview",
    totalHolds: "Total holds",
    
    // Validation messages
    actionCannotBeUndone: "This action cannot be undone.",
    areYouSureDeleteAllRoutes: "Are you sure you want to delete all saved routes? This action cannot be undone.",
    
    // Settings modal descriptions
    chooseGradeSystem: "Choose your preferred climbing grade system. Saved routes will be displayed in the selected system.",
    chooseLanguage: "Choose your preferred language for the app interface.",
    
    // Create screen controls
    doubleLed: "Double LED"
  },
  
  es: {
    // App name
    appName: "La Fusteria",
    
    // Navigation
    create: "Crear",
    routes: "Rutas",
    settings: "Configuración",
    
    // Create screen
    connectBoard: "Conectar Placa",
    disconnect: "Desconectar",
    clearAll: "Limpiar Todo",
    saveRoute: "Guardar Ruta",
    ledColor: "Color LED",
    climbingWall: "Muro de Escalada",
    selectedColor: "Color Seleccionado",
    tapHoldsToToggle: "Toca las presas para alternar LEDs",
    holdsSelected: "presas seleccionadas",
    
    // Color labels
    top: "Final",
    feet: "Pies",
    hands: "Manos", 
    start: "Inicio",
    
    // Save route modal
    routeName: "Nombre de la Ruta",
    enterRouteName: "Introduce el nombre de la ruta",
    setter: "Aperturista",
    enterSetterName: "Introduce el nombre del aperturista",
    gradeDifficulty: "Grado/Dificultad",
    type: "Tipo",
    boulder: "Bloque",
    route: "Ruta",
    cancel: "Cancelar",
    save: "Guardar",
    
    // Routes screen
    savedRoutes: "Rutas Guardadas",
    noRoutesYet: "Aún No Hay Rutas",
    createFirstRoute: "Crea tu primera ruta de escalada en la pestaña Crear",
    of: "de",
    routesCount: "rutas",
    filtered: "(filtradas)",
    noRoutesMatchFilters: "Ninguna Ruta Coincide con los Filtros",
    tryAdjustingFilters: "Intenta ajustar tus filtros o límpialos para ver todas las rutas",
    clearFilters: "Limpiar Filtros",
    filterRoutes: "Filtrar Rutas",
    allTypes: "Todos los Tipos",
    allGrades: "Todos los Grados",
    clear: "Limpiar",
    
    // Settings screen
    connection: "Conexión",
    connectToBoard: "Conectar a la Placa",
    disconnectBoard: "Desconectar Placa",
    currentlyConnected: "Actualmente conectado",
    tapToConnect: "Toca para conectar",
    wallConfiguration: "Configuración del Muro",
    matrixSize: "Tamaño de la Matriz",
    current: "Actual",
    dataManagement: "Gestión de Datos",
    clearAllRoutes: "Limpiar Todas las Rutas",
    deleteAllSavedRoutes: "Eliminar todas las rutas de escalada guardadas",
    about: "Acerca de",
    version: "Versión",
    appDescription: "Crea y gestiona rutas de escalada con muros de entrenamiento mejorados con LED. Conecta a dispositivos de placa para controlar matrices LED para visualización interactiva de rutas.",
    ledColors: "Colores LED",
    redTopFinish: "Rojo - Presas de Final/Top",
    orangeFoot: "Naranja - Presas de Pie",
    blueHand: "Azul - Presas de Mano",
    greenStart: "Verde - Presas de Inicio",
    gradeSystem: "Sistema de Grados",
    language: "Idioma",
    
    // Grade systems
    french: "Francés",
    yds: "YDS (Americano)",
    uiaa: "UIAA",
    british: "Británico",
    "v-scale": "V-Scale (Bloque)",
    
    // Languages
    english: "Inglés",
    spanish: "Español",
    catalan: "Catalán", 
    frenchLang: "Francés",
    german: "Alemán",
    
    // Alerts and messages
    success: "Éxito",
    error: "Error",
    notConnected: "No Conectado",
    pleaseConnectFirst: "Por favor conecta a la placa primero",
    routeSavedSuccessfully: "¡Ruta guardada exitosamente!",
    pleaseEnterRouteName: "Por favor introduce un nombre de ruta",
    pleaseEnterSetterName: "Por favor introduce el nombre del aperturista",
    pleaseEnterValidGrade: "Por favor introduce un grado válido",
    pleaseSelectAtLeastOneHold: "Por favor selecciona al menos una presa",
    deleteRoute: "Eliminar Ruta",
    areYouSureDelete: "¿Estás seguro de que quieres eliminar",
    delete: "Eliminar",
    connectedToBoard: "Conectado a la placa",
    disconnectedFromBoard: "Desconectado de la placa",
    allLedsOff: "Todos los LEDs apagados",
    failedToClearLeds: "Error al limpiar LEDs",
    routeDisplayedOnWall: "ahora se muestra en el muro",
    failedToLoadRoute: "Error al cargar la ruta",
    allRoutesDeleted: "Todas las rutas han sido eliminadas",
    ok: "OK",
    
    // Matrix configuration
    adjustMatrixSize: "Ajusta el tamaño de tu matriz del muro de escalada. Esto afectará cómo se muestran las presas en la aplicación.",
    rows: "Filas",
    columns: "Columnas",
    preview: "Vista Previa",
    totalHolds: "Total de presas",
    
    // Validation messages
    actionCannotBeUndone: "Esta acción no se puede deshacer.",
    areYouSureDeleteAllRoutes: "¿Estás seguro de que quieres eliminar todas las rutas guardadas? Esta acción no se puede deshacer.",
    
    // Settings modal descriptions
    chooseGradeSystem: "Elige tu sistema de grados de escalada preferido. Las rutas guardadas se mostrarán en el sistema seleccionado.",
    chooseLanguage: "Elige tu idioma preferido para la interfaz de la aplicación.",
    
    // Create screen controls
    doubleLed: "LED Doble"
  },
  
  ca: {
    // App name
    appName: "La Fusteria",
    
    // Navigation
    create: "Crear",
    routes: "Rutes",
    settings: "Configuració",
    
    // Create screen
    connectBoard: "Connectar Placa",
    disconnect: "Desconnectar",
    clearAll: "Netejar Tot",
    saveRoute: "Guardar Ruta",
    ledColor: "Color LED",
    climbingWall: "Mur d'Escalada",
    selectedColor: "Color Seleccionat",
    tapHoldsToToggle: "Toca les preses per alternar LEDs",
    holdsSelected: "preses seleccionades",
    
    // Color labels
    top: "Final",
    feet: "Peus",
    hands: "Mans",
    start: "Inici",
    
    // Save route modal
    routeName: "Nom de la Ruta",
    enterRouteName: "Introdueix el nom de la ruta",
    setter: "Oberturista",
    enterSetterName: "Introdueix el nom de l'oberturista",
    gradeDifficulty: "Grau/Dificultat",
    type: "Tipus",
    boulder: "Bloc",
    route: "Ruta",
    cancel: "Cancel·lar",
    save: "Guardar",
    
    // Routes screen
    savedRoutes: "Rutes Guardades",
    noRoutesYet: "Encara No Hi Ha Rutes",
    createFirstRoute: "Crea la teva primera ruta d'escalada a la pestanya Crear",
    of: "de",
    routesCount: "rutes",
    filtered: "(filtrades)",
    noRoutesMatchFilters: "Cap Ruta Coincideix amb els Filtres",
    tryAdjustingFilters: "Prova d'ajustar els teus filtres o neteja'ls per veure totes les rutes",
    clearFilters: "Netejar Filtres",
    filterRoutes: "Filtrar Rutes",
    allTypes: "Tots els Tipus",
    allGrades: "Tots els Graus",
    clear: "Netejar",
    
    // Settings screen
    connection: "Connexió",
    connectToBoard: "Connectar a la Placa",
    disconnectBoard: "Desconnectar Placa",
    currentlyConnected: "Actualment connectat",
    tapToConnect: "Toca per connectar",
    wallConfiguration: "Configuració del Mur",
    matrixSize: "Mida de la Matriu",
    current: "Actual",
    dataManagement: "Gestió de Dades",
    clearAllRoutes: "Netejar Totes les Rutes",
    deleteAllSavedRoutes: "Eliminar totes les rutes d'escalada guardades",
    about: "Sobre",
    version: "Versió",
    appDescription: "Crea i gestiona rutes d'escalada amb murs d'entrenament millorats amb LED. Connecta a dispositius de placa per controlar matrius LED per a visualització interactiva de rutes.",
    ledColors: "Colors LED",
    redTopFinish: "Vermell - Preses de Final/Top",
    orangeFoot: "Taronja - Preses de Peu",
    blueHand: "Blau - Preses de Mà",
    greenStart: "Verde - Preses d'Inici",
    gradeSystem: "Sistema de Graus",
    language: "Idioma",
    
    // Grade systems
    french: "Francès",
    yds: "YDS (Americà)",
    uiaa: "UIAA",
    british: "Britànic",
    "v-scale": "V-Scale (Bloc)",
    
    // Languages
    english: "Anglès",
    spanish: "Espanyol",
    catalan: "Català",
    frenchLang: "Francès",
    german: "Alemany",
    
    // Alerts and messages
    success: "Èxit",
    error: "Error",
    notConnected: "No Connectat",
    pleaseConnectFirst: "Si us plau connecta a la placa primer",
    routeSavedSuccessfully: "Ruta guardada amb èxit!",
    pleaseEnterRouteName: "Si us plau introdueix un nom de ruta",
    pleaseEnterSetterName: "Si us plau introdueix el nom de l'oberturista",
    pleaseEnterValidGrade: "Si us plau introdueix un grau vàlid",
    pleaseSelectAtLeastOneHold: "Si us plau selecciona almenys una presa",
    deleteRoute: "Eliminar Ruta",
    areYouSureDelete: "Estàs segur que vols eliminar",
    delete: "Eliminar",
    connectedToBoard: "Connectat a la placa",
    disconnectedFromBoard: "Desconnectat de la placa",
    allLedsOff: "Tots els LEDs apagats",
    failedToClearLeds: "Error al netejar LEDs",
    routeDisplayedOnWall: "ara es mostra al mur",
    failedToLoadRoute: "Error al carregar la ruta",
    allRoutesDeleted: "Totes les rutes han estat eliminades",
    ok: "OK",
    
    // Matrix configuration
    adjustMatrixSize: "Ajusta la mida de la teva matriu del mur d'escalada. Això afectarà com es mostren les preses a l'aplicació.",
    rows: "Files",
    columns: "Columnes",
    preview: "Vista Prèvia",
    totalHolds: "Total de preses",
    
    // Validation messages
    actionCannotBeUndone: "Aquesta acció no es pot desfer.",
    areYouSureDeleteAllRoutes: "Estàs segur que vols eliminar totes les rutes guardades? Aquesta acció no es pot desfer.",
    
    // Settings modal descriptions
    chooseGradeSystem: "Tria el teu sistema de graus d'escalada preferit. Les rutes guardades es mostraran en el sistema seleccionat.",
    chooseLanguage: "Tria el teu idioma preferit per a la interfície de l'aplicació.",
    
    // Create screen controls
    doubleLed: "LED Doble"
  },
  
  fr: {
    // App name
    appName: "La Fusteria",
    
    // Navigation
    create: "Créer",
    routes: "Voies",
    settings: "Paramètres",
    
    // Create screen
    connectBoard: "Connecter Plaque",
    disconnect: "Déconnecter",
    clearAll: "Tout Effacer",
    saveRoute: "Sauvegarder Voie",
    ledColor: "Couleur LED",
    climbingWall: "Mur d'Escalade",
    selectedColor: "Couleur Sélectionnée",
    tapHoldsToToggle: "Touchez les prises pour basculer les LEDs",
    holdsSelected: "prises sélectionnées",
    
    // Color labels
    top: "Sommet",
    feet: "Pieds",
    hands: "Mains",
    start: "Départ",
    
    // Save route modal
    routeName: "Nom de la Voie",
    enterRouteName: "Entrez le nom de la voie",
    setter: "Ouvreur",
    enterSetterName: "Entrez le nom de l'ouvreur",
    gradeDifficulty: "Cotation/Difficulté",
    type: "Type",
    boulder: "Bloc",
    route: "Voie",
    cancel: "Annuler",
    save: "Sauvegarder",
    
    // Routes screen
    savedRoutes: "Voies Sauvegardées",
    noRoutesYet: "Pas Encore de Voies",
    createFirstRoute: "Créez votre première voie d'escalade dans l'onglet Créer",
    of: "de",
    routesCount: "voies",
    filtered: "(filtrées)",
    noRoutesMatchFilters: "Aucune Voie ne Correspond aux Filtres",
    tryAdjustingFilters: "Essayez d'ajuster vos filtres ou effacez-les pour voir toutes les voies",
    clearFilters: "Effacer les Filtres",
    filterRoutes: "Filtrer les Voies",
    allTypes: "Tous les Types",
    allGrades: "Toutes les Cotations",
    clear: "Effacer",
    
    // Settings screen
    connection: "Connexion",
    connectToBoard: "Connecter à la Plaque",
    disconnectBoard: "Déconnecter Plaque",
    currentlyConnected: "Actuellement connecté",
    tapToConnect: "Touchez pour connecter",
    wallConfiguration: "Configuration du Mur",
    matrixSize: "Taille de la Matrice",
    current: "Actuel",
    dataManagement: "Gestion des Données",
    clearAllRoutes: "Effacer Toutes les Voies",
    deleteAllSavedRoutes: "Supprimer toutes les voies d'escalade sauvegardées",
    about: "À Propos",
    version: "Version",
    appDescription: "Créez et gérez des voies d'escalade avec des murs d'entraînement améliorés par LED. Connectez-vous aux dispositifs de plaque pour contrôler les matrices LED pour la visualisation interactive des voies.",
    ledColors: "Couleurs LED",
    redTopFinish: "Rouge - Prises de Sommet/Fin",
    orangeFoot: "Orange - Prises de Pied",
    blueHand: "Bleu - Prises de Main",
    greenStart: "Vert - Prises de Départ",
    gradeSystem: "Système de Cotation",
    language: "Langue",
    
    // Grade systems
    french: "Français",
    yds: "YDS (Américain)",
    uiaa: "UIAA",
    british: "Britannique",
    "v-scale": "V-Scale (Bloc)",
    
    // Languages
    english: "Anglais",
    spanish: "Espagnol",
    catalan: "Catalan",
    frenchLang: "Français",
    german: "Allemand",
    
    // Alerts and messages
    success: "Succès",
    error: "Erreur",
    notConnected: "Non Connecté",
    pleaseConnectFirst: "Veuillez d'abord vous connecter à la plaque",
    routeSavedSuccessfully: "Voie sauvegardée avec succès !",
    pleaseEnterRouteName: "Veuillez entrer un nom de voie",
    pleaseEnterSetterName: "Veuillez entrer le nom de l'ouvreur",
    pleaseEnterValidGrade: "Veuillez entrer une cotation valide",
    pleaseSelectAtLeastOneHold: "Veuillez sélectionner au moins une prise",
    deleteRoute: "Supprimer Voie",
    areYouSureDelete: "Êtes-vous sûr de vouloir supprimer",
    delete: "Supprimer",
    connectedToBoard: "Connecté à la plaque",
    disconnectedFromBoard: "Déconnecté de la plaque",
    allLedsOff: "Toutes les LEDs éteintes",
    failedToClearLeds: "Échec de l'effacement des LEDs",
    routeDisplayedOnWall: "est maintenant affichée sur le mur",
    failedToLoadRoute: "Échec du chargement de la voie",
    allRoutesDeleted: "Toutes les voies ont été supprimées",
    ok: "OK",
    
    // Matrix configuration
    adjustMatrixSize: "Ajustez la taille de votre matrice de mur d'escalade. Cela affectera la façon dont les prises sont affichées dans l'application.",
    rows: "Lignes",
    columns: "Colonnes",
    preview: "Aperçu",
    totalHolds: "Total des prises",
    
    // Validation messages
    actionCannotBeUndone: "Cette action ne peut pas être annulée.",
    areYouSureDeleteAllRoutes: "Êtes-vous sûr de vouloir supprimer toutes les voies sauvegardées ? Cette action ne peut pas être annulée.",
    
    // Settings modal descriptions
    chooseGradeSystem: "Choisissez votre système de cotation d'escalade préféré. Les voies sauvegardées seront affichées dans le système sélectionné.",
    chooseLanguage: "Choisissez votre langue préférée pour l'interface de l'application.",
    
    // Create screen controls
    doubleLed: "LED Double"
  },
  
  de: {
    // App name
    appName: "La Fusteria",
    
    // Navigation
    create: "Erstellen",
    routes: "Routen",
    settings: "Einstellungen",
    
    // Create screen
    connectBoard: "Board Verbinden",
    disconnect: "Trennen",
    clearAll: "Alles Löschen",
    saveRoute: "Route Speichern",
    ledColor: "LED-Farbe",
    climbingWall: "Kletterwand",
    selectedColor: "Ausgewählte Farbe",
    tapHoldsToToggle: "Tippen Sie auf Griffe, um LEDs umzuschalten",
    holdsSelected: "Griffe ausgewählt",
    
    // Color labels
    top: "Top",
    feet: "Füße",
    hands: "Hände",
    start: "Start",
    
    // Save route modal
    routeName: "Routenname",
    enterRouteName: "Routenname eingeben",
    setter: "Routenbauer",
    enterSetterName: "Name des Routenbauers eingeben",
    gradeDifficulty: "Grad/Schwierigkeit",
    type: "Typ",
    boulder: "Boulder",
    route: "Route",
    cancel: "Abbrechen",
    save: "Speichern",
    
    // Routes screen
    savedRoutes: "Gespeicherte Routen",
    noRoutesYet: "Noch Keine Routen",
    createFirstRoute: "Erstellen Sie Ihre erste Kletterroute im Tab Erstellen",
    of: "von",
    routesCount: "Routen",
    filtered: "(gefiltert)",
    noRoutesMatchFilters: "Keine Routen Entsprechen den Filtern",
    tryAdjustingFilters: "Versuchen Sie, Ihre Filter anzupassen oder löschen Sie sie, um alle Routen zu sehen",
    clearFilters: "Filter Löschen",
    filterRoutes: "Routen Filtern",
    allTypes: "Alle Typen",
    allGrades: "Alle Grade",
    clear: "Löschen",
    
    // Settings screen
    connection: "Verbindung",
    connectToBoard: "Mit Board Verbinden",
    disconnectBoard: "Board Trennen",
    currentlyConnected: "Derzeit verbunden",
    tapToConnect: "Tippen zum Verbinden",
    wallConfiguration: "Wandkonfiguration",
    matrixSize: "Matrixgröße",
    current: "Aktuell",
    dataManagement: "Datenverwaltung",
    clearAllRoutes: "Alle Routen Löschen",
    deleteAllSavedRoutes: "Alle gespeicherten Kletterrouten löschen",
    about: "Über",
    version: "Version",
    appDescription: "Erstellen und verwalten Sie Kletterrouten mit LED-verbesserten Trainingswänden. Verbinden Sie sich mit Board-Geräten, um LED-Matrizen für interaktive Routenvisualisierung zu steuern.",
    ledColors: "LED-Farben",
    redTopFinish: "Rot - Top/Endgriffe",
    orangeFoot: "Orange - Fußgriffe",
    blueHand: "Blau - Handgriffe",
    greenStart: "Grün - Startgriffe",
    gradeSystem: "Bewertungssystem",
    language: "Sprache",
    
    // Grade systems
    french: "Französisch",
    yds: "YDS (Amerikanisch)",
    uiaa: "UIAA",
    british: "Britisch",
    "v-scale": "V-Scale (Boulder)",
    
    // Languages
    english: "Englisch",
    spanish: "Spanisch",
    catalan: "Katalanisch",
    frenchLang: "Französisch",
    german: "Deutsch",
    
    // Alerts and messages
    success: "Erfolg",
    error: "Fehler",
    notConnected: "Nicht Verbunden",
    pleaseConnectFirst: "Bitte verbinden Sie sich zuerst mit dem Board",
    routeSavedSuccessfully: "Route erfolgreich gespeichert!",
    pleaseEnterRouteName: "Bitte geben Sie einen Routennamen ein",
    pleaseEnterSetterName: "Bitte geben Sie den Namen des Routenbauers ein",
    pleaseEnterValidGrade: "Bitte geben Sie einen gültigen Grad ein",
    pleaseSelectAtLeastOneHold: "Bitte wählen Sie mindestens einen Griff aus",
    deleteRoute: "Route Löschen",
    areYouSureDelete: "Sind Sie sicher, dass Sie löschen möchten",
    delete: "Löschen",
    connectedToBoard: "Mit Board verbunden",
    disconnectedFromBoard: "Vom Board getrennt",
    allLedsOff: "Alle LEDs ausgeschaltet",
    failedToClearLeds: "Fehler beim Löschen der LEDs",
    routeDisplayedOnWall: "wird jetzt an der Wand angezeigt",
    failedToLoadRoute: "Fehler beim Laden der Route",
    allRoutesDeleted: "Alle Routen wurden gelöscht",
    ok: "OK",
    
    // Matrix configuration
    adjustMatrixSize: "Passen Sie die Größe Ihrer Kletterwand-Matrix an. Dies beeinflusst, wie die Griffe in der App angezeigt werden.",
    rows: "Zeilen",
    columns: "Spalten",
    preview: "Vorschau",
    totalHolds: "Griffe insgesamt",
    
    // Validation messages
    actionCannotBeUndone: "Diese Aktion kann nicht rückgängig gemacht werden.",
    areYouSureDeleteAllRoutes: "Sind Sie sicher, dass Sie alle gespeicherten Routen löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
    
    // Settings modal descriptions
    chooseGradeSystem: "Wählen Sie Ihr bevorzugtes Kletter-Bewertungssystem. Gespeicherte Routen werden im ausgewählten System angezeigt.",
    chooseLanguage: "Wählen Sie Ihre bevorzugte Sprache für die App-Oberfläche.",
    
    // Create screen controls
    doubleLed: "Doppel-LED"
  }
};

export function getTranslation(key: string, language: Language = "en"): string {
  const keys = key.split(".");
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found in fallback
        }
      }
      break;
    }
  }
  
  return typeof value === "string" ? value : key;
}