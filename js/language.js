
var language = new LanguageHandler();

function LanguageHandler(){
	
	var defaultLanguage = "de";
	
	var language = detectLanguage();

	var lang = {
		 en: {
			 startScreen: "Connect your controller and press Start!"
			,winner: "Winner!"
			,endScreen: "Press Start for a new match!"
		}
		,de: {
			 startScreen: "Schliesse deinen Controller an und drücke Start!"
			,winner: "Winner!"
			,endScreen: "Drücke Start für eine neue Runde!"
		}
		,fr: {
			 startScreen: "Branche ta console et appuye sur «Start»!"
			,winner: "Winner!"
			,endScreen: "Presse «Start» pour un nouveau tour."
		}
		,it: {
			 startScreen: "Collega il tuo Controller e premi «Start»!"
			,winner: "Winner!"
			,endScreen: "Premi «Start» per iniziare un nuovo turno."
		}
		,rm: {
			 startScreen: "Rumantsch rumantsch rumantsch!"
			,winner: "Winner!"
			,endScreen: "Rumantsch!"
		}
	}
	
	function detectLanguage(){
		var search = location.search.trim().substring(1).split("/")[0];
		if(!search){
			search = defaultLanguage;
		}
		console.log(search);
		return search;
	}
	
	this.getString = function(string){
		return lang[language][string];
	}

}