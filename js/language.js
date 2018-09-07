
var language = new LanguageHandler();

function LanguageHandler(){
	
	var defaultLanguage = "de";

	var lang = {
		 en: {
			 startScreen: "Connect your controller and press Start!"
			,winner: "Winner!"
			,endScreen: "Press Start or Enter for a new match!"
			,keyboardText: "...or press Enter for keyboard controls"
			,pressOne: "Press 1 for one player!"
			,pressTwo: "Press 2 for two players!"
			,playerOne: "Player 1"
			,playerTwo: "Player 2"
		}
		,de: {
			 startScreen: "Schliesse deinen Controller an und drücke Start!"
			,winner: "Winner!"
			,endScreen: "Drücke Start oder Enter für eine neue Runde!"
			,keyboardText: "...oder drücke Enter für Tastatursteuerung"
			,pressOne: "Drücke 1 für einen Spieler!"
			,pressTwo: "Drücke 2 für zwei Spieler!"
			,playerOne: "Spieler 1"
			,playerTwo: "Spieler 2"
		}
		,fr: {
			 startScreen: "Branche ta console et appuye sur «Start»!"
			,winner: "Winner!"
			,endScreen: "Presse «Start» ou «Enter» pour un nouveau tour."
			,keyboardText: "... ou presse «Enter» pour les contrôles du clavier"
			,pressOne: "Presse 1 pour un joueur!"
			,pressTwo: "Presse 2 pour deux joueurs!"
			,playerOne: "Joueur 1"
			,playerTwo: "Joueur 2"
		}
		,it: {
			 startScreen: "Collega il tuo Controller e premi «Start»!"
			,winner: "Winner!"
			,endScreen: "Premi «Start» o «Enter» per iniziare un nuovo turno."
			,keyboardText: "... o premi «Enter» per i comandi della tastiera"
			,pressOne: "Premi 1 per un giocatore!"
			,pressTwo: "Premi 2 per due giocatori!"
			,playerOne: "Giocatore 1"
			,playerTwo: "Giocatore 2"
		}
	}
	
	this.detectLanguage = function(){
		var search = location.search.trim().substring(1).split("/")[0];
		if(!search){
			this.isDefault = true;
			search = defaultLanguage;
		}
		return search;
	}
	
	this.getString = function(string, language){
		if(!language){
			language = this.language;
		}
		return lang[language][string];
	}
	
	this.isDefault = false;
	this.language = this.detectLanguage();

}