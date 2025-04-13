import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBYcTwJLUA9YXfZsigyLGJy6WMsYKfdJXo",
    authDomain: "ncpi-102ca.firebaseapp.com",
    databaseURL: "https://ncpi-102ca-default-rtdb.firebaseio.com",
    projectId: "ncpi-102ca",
    storageBucket: "ncpi-102ca.appspot.com",
    messagingSenderId: "592471971260",
    appId: "1:592471971260:web:acea66a4add39211d387b9",
    measurementId: "G-KR1NKD77R7"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);