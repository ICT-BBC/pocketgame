
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
			 startScreen: "TODO Branche ton contrôleur et appuye sur Start!"
			,winner: "Winner!"
			,endScreen: "TODO Appuye sur Start pour un nouveau match!"
		}
		,it: {
			 startScreen: "TODO Collega il controller e premi Start!"
			,winner: "Winner!"
			,endScreen: "TODO Premi Start per un nuovo round!"
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