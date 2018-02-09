/////////////////////////YOUTUBE IFRAME API//////////////////////
/*
load yt Iframe api script
*/
var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

/*
define yt player parameters
*/
var ytPlayer; // youtube player
var ytPlayerVars = {'autoplay': 1, 'controls': 0, 'origin': 'http://www.localhost.com:8888'}; //palyer vars
var ytPlayerSize = {'width':640, 'height':390}; //player size
var currentVideoId = '';
/*
on API ready
*/
function onYouTubeIframeAPIReady() {
	$("#ytPlayer-wrapper").html('<div id="caseVideoPlayer">Loading...</div>');
	createNewPlayer('',"#ytPlayer-wrapper");
}

/*
function - create youtube player for case video 
*/
function loadVideoPlayer(videoId){
	//console.log("currentVideoId: " + currentVideoId + "\nvideoId: " + videoId);
	
	if(videoId != currentVideoId){
		createNewPlayer(videoId);
		currentVideoId = videoId;
	}else{
		ytPlayer.playVideo();
	}
	
	//console.log("UPDATED currentVideoId: " + currentVideoId + "\nvideoId: " + videoId);
};

function createNewPlayer(videoId,container){
	var ctn = container?container:document;
	//console.log("ytPlayer container: " + container + "\nctn: " + ctn);
	if(ytPlayer != undefined){
		//console.log("ytPlayer exist");
		ytPlayer.clearVideo();
		$("#"+ytPlayer.getIframe().id).parent().html('<div id="caseVideoPlayer">Loading...</div>');
	}
	
	ytPlayer = new YT.Player('caseVideoPlayer', {
		width: ytPlayerSize.width,
		height: ytPlayerSize.height,
		videoId: videoId,
		playerVars: ytPlayerVars,
		events: {
			'onReady': onPlayerReady,
			'onError': onPlayerError,
			'onApiChange': onApiChange,
			'onStateChange': onStateChange
		}
	});
	
	function onPlayerReady(event) {
		//ytPlayer.loadVideoById(videoId,0,'large');
		//console.log(event.target + "\n" + "videoPlayer is ready");
		//caseVideoPlayer = event.target;
	};

	function onPlayerError(event) {
		//console.log(event.data + "\n" + "videoPlayer has error");
	};
	
	function onApiChange(event) {
		//console.log(event.data + "\n" + "ytPlayer API Change");
	};
	
	function onStateChange(event) {
		//console.log("onStateChange: " + event.data + "\n" );
	};
	//console.log("ytPlayer has been created");
}
/////////////////////////EOF YOUTUBE IFRAME API//////////////////////

/////////////////////////INITIATE GAMEDATA//////////////////
window.caseData = {};//storage for current case data
window.caseIndex = 0; // current case id
window.numCases = 0; // total number of cases
window.casesUris = []; //cases uri list

window.onNextwebOnedb = function() {
	server = Nextweb.startServer(7661);
	session = Nextweb.createSession();
	seed = session.seed("local");

	window.gamedata.writeCaseData(session, seed, function() {
		// called back when default game data is written 
		
		// select all nodes has brandName type in order to get case nodes
		var caseNodes = seed.selectAll().select(session.node("http://slicnet.com/mxrogm/mxrogm/apps/nodejump/docs/8/n/Types/Brand_Name"));	
		
		// get cases uri list 
		caseNodes.each(function(node){
			//console.log("nodes: " + getParentUri(node.uri(),1));
			window.casesUris.push(getParentUri(node.uri(),1));
			//console.log("casesUris: " + casesUris.toString());
		});
		
		// count total number of cases
		window.numCases = window.casesUris.length;
		
		// get gamedate of current case
		window.renderStrategyQuestion(session, session.node(getCaseUri()), function() {
			/*
			 session.close().get(function(success) {
			 server.shutdown().get(function(success) {
			 $(".output").append("<p>All done.</p>");
			 */	
		});
	});
}; 


window.renderStrategyQuestion = function(session, caseNode, onSuccess) {
	//console.log("Current Case: " + window.caseIndex + "\nCase URI: " + getCaseUri() + "\nTotal Cases: " + window.numCases);
	
	var t = window.gamedata.createTypes(session);
	
	/*
	* Questino Data
	*/
	var brandName = caseNode.select(t.brandName);
	var brandImage = caseNode.select(t.brandImage);
	var brandVideo = caseNode.select(t.brandVideo);
	var industry = caseNode.select(t.industry);
	var vision = caseNode.select(t.vision);
	
	/*
	* Strategy Quadrant Game Data
	*/
	var correctStrategy = caseNode.select(t.correctStrategy);
	var competitiveScope = caseNode.select(t.competitiveScope);
	var costStrategy = caseNode.select(t.costStrategy);
	
	/*
	* Porter's Five Forces Game Data
	*/
	var correctIndustryStructure = caseNode.select(t.correctIndustryStructure);
	var threatOfSubsitutes = caseNode.select(t.threatOfSubsitutes);
	var supplierPower = caseNode.select(t.supplierPower);
	var rivarly = caseNode.select(t.rivarly);
	var buyerPower = caseNode.select(t.buyerPower);
	var newEntrants = caseNode.select(t.newEntrants);
	
	/*
	* Value Chain Activites Game Data
	*/
	var correctValueChainActivites = caseNode.select(t.correctValueChainActivites);
	var valueChainJustification = caseNode.select(t.valueChainJustification);
	/*
	* Business Process Game Data
	*/
	var processName = caseNode.select(t.processName);
	var importantProcess = caseNode.select(t.importantProcess);
	var processSteps = caseNode.select(t.processSteps);

	/*
	* Systems Game Data
	*/
	var systems = caseNode.select(t.systems);
	var orgUnits = caseNode.select(t.orgUnits);
	
	
	
	session.getAll(brandName, brandImage, brandVideo, industry, vision, correctStrategy, competitiveScope, costStrategy, correctIndustryStructure, threatOfSubsitutes, supplierPower, rivarly, buyerPower, newEntrants, correctValueChainActivites, valueChainJustification, processName, importantProcess, processSteps, systems, orgUnits, function() {
		var cData = {};
		var gData = {};
		cData.brandImage = brandImage.get().value();
		cData.brandName = brandName.get().value();
		cData.videoLink = getURLParameter(brandVideo.get().value(), 'v');
		//cData.videoLink =  brandVideo.get().value();
		cData.vision = vision.get().value();
		cData.industry = industry.get().value();
		
		var stData = {};
		stData.correctStrategy = correctStrategy.get().value();
		stData.competitiveScope = competitiveScope.get().value()
		stData.costStrategy = costStrategy.get().value();
		gData[gameTypes.types.strategyQuadrant.name] = stData;
		//console.log(gameTypes.types.strategyQuadrant.name);
		
		var pfData = {};
		pfData.industryStructure = correctIndustryStructure.get().value();
		pfData.threatofSubstitutes = threatOfSubsitutes.get().value();
		pfData.supplierPower = supplierPower.get().value();
		pfData.rivalryAmongCompetitors = rivarly.get().value();
		pfData.buyerPower = buyerPower.get().value();
		pfData.threatofNewEntrants = newEntrants.get().value();
		gData[gameTypes.types.portersFive.name] = pfData;
		
		var vcData = {};
		vcData.valueChainActivites = correctValueChainActivites.get().value();
		vcData.activitiesJustification = replaceLineBreak(valueChainJustification.get().value());
		gData[gameTypes.types.valueChain.name] = vcData;
		
		var bpData = {};
		bpData.processName = processName.get().value();
		bpData.importantProcessJustification = importantProcess.get().value();
		bpData.processSteps = processSteps.get().value();
		gData[gameTypes.types.businessProcess.name] = bpData;

		var ssData = {};
		ssData.systems = systems.get().value();
		ssData.organizationalUnits = orgUnits.get().value();
		gData[gameTypes.types.systemsOrgUnits.name] = ssData;
		
		createCaseData(cData, gData);
		
		$(".output .case-logo").html('<img width="240px" height="auto" src="' + caseData.brandImage + '"><span class="ui-icon-video-large"></span>');
		$(".output .case-industry").html('<h4>Industry: </h4><p>' + caseData.industry + '</p>');
		$(".output .case-vision").html('<h4>Vision: </h4><p>' + caseData.vision + '</p>');
		$(".output .case-brand").html('<h4>Brand: </h4><p>' + caseData.brandName + '</p>');

		onSuccess();
	});
};


////////////////////////////////GAMEDATA OBJECTS MAPPING////////////////////////
function createCaseData(caseDataObj, gameDataObj){
	window.caseData = createCaseData();
	window.gameData = caseData.games;
	
	function createCaseData(){
		var data = new caseDataFactory.caseData();
		for (prop in caseDataObj){
			if(data.hasOwnProperty(prop)){
				data[prop] = caseDataObj[prop]	;
			}
		}
		
		data.games = createGameData();
		return data;
	}
	
	function createGameData(){
		var types = gameTypes.types;
		var data = new Object();
		for ( type in types){
			//console.log(type, caseDataFactory[type]);
			//console.log(type);
			data[type] = new caseDataFactory[type];
			if(gameDataObj[type]){
				for (prop in data[type]){
					if(data[type].hasOwnProperty(prop)&&prop!='gameType'){
						data[type][prop] = gameDataObj[type][prop];
					}
				}
			}	
		}
		
		return data;
	}
	//console.log("caseData: ", caseData, "\ngameData: " , gameData);
}

var caseDataFactory = {
	caseData:
	//case data object
	function caseData(brandName,vision, brandImage, videoLink, industry, games){
		this.brandName = brandName;
		this.vision = vision;
		this.brandImage = brandImage;
		this.videoLink = videoLink;
		this.industry = industry;
		this.games = games;
	},
	//games data objects
	strategyQuadrant:
	function strategyQuadrant(correctStrategy, competitiveScope, costStrategy){
		this.correctStrategy = correctStrategy;
		this.competitiveScope = competitiveScope;
		this.costStrategy = costStrategy;
		this.gameType = gameTypes.types.strategyQuadrant;
	},
	portersFive:
	function portersFive(industryStructure, buyerPower, supplierPower, threatofSubstitutes, rivalryAmongCompetitors, threatofNewEntrants){
		this.industryStructure = industryStructure;
		this.buyerPower = buyerPower;
		this.supplierPower = supplierPower;
		this.threatofSubstitutes = threatofSubstitutes;
		this.rivalryAmongCompetitors = rivalryAmongCompetitors;
		this.threatofNewEntrants = threatofNewEntrants;
		this.gameType = gameTypes.types.portersFive;
	},
	valueChain:
	function valueChain(valueChainActivites, activitiesJustification){
		this.valueChainActivites = valueChainActivites;
		this.activitiesJustification = activitiesJustification;
		this.gameType = gameTypes.types.valueChain;
	},
	businessProcess:
	function businessProcess(processName, importantProcessJustification, processSteps){
		this.processName = processName;
		this.importantProcessJustification = importantProcessJustification;
		this.processSteps = processSteps;
		this.gameType = gameTypes.types.businessProcess;
	},
	systemsOrgUnits:
	function systemsOrgUnits(systems, organizationalUnits){
		this.systems = systems;
		this.organizationalUnits = organizationalUnits;
		this.gameType = gameTypes.types.systemsOrgUnits;
	}
}
//game types
var gameTypes = {
	types: {
		strategyQuadrant : {id:1, uri:"http://slicnet.com/mxrogm/mxrogm/apps/nodejump/docs/8/n/Types/Strategy_Quadrant_Questi", type:"GAME_TYPE_STRATEGY_QUADRANT",name:"strategyQuadrant"},
		portersFive : {id:2, uri:"http://slicnet.com/mxrogm/mxrogm/apps/nodejump/docs/8/n/Types/Porter_s_5_Question", type:"GAME_TYPE_PORTERS_FIVE",name:"portersFive"},
		valueChain : {id:3, uri:"http://slicnet.com/mxrogm/mxrogm/apps/nodejump/docs/8/n/Types/Value_Chain_Question", type:"GAME_TYPE_VALUE_CHAIN",name:"valueChain"},
		businessProcess : {id:4, uri:"http://slicnet.com/mxrogm/mxrogm/apps/nodejump/docs/8/n/Types/Value_Chain_Question", type:"GAME_TYPE_BUSINESS_PROCESS",name:"businessProcess"},
		systemsOrgUnits : {id:5, uri:"http://slicnet.com/mxrogm/mxrogm/apps/nodejump/docs/8/n/Types/Systems_Question", type:"GAME_TYPE_SYSTEMS_ORG_UNITS",name:"systemsOrgUnits"},
	},
	errors:{
		noMatch : {id:0, data:"type not found error", name:"GAME_TYPE_ERROR_NOT_FOUND",name:"noMatch"},
	},
	getGameTypeByName: 
	function getGameTypeByName(name){
		var type = {};
		switch(name){
			case 	this.types.strategyQuadrant.name:
				type = this.types.strategyQuadrant;
				break;
			case 	this.types.portersFive.name:
				type = this.types.portersFive;
				break;
			case 	this.types.valueChain.name:
				type = this.types.valueChain;
				break;
			case 	this.types.businessProcess.name:
				type = this.types.businessProcess;
				break;
			case 	this.types.systemsOrgUnits.name:
				type = this.types.systemsOrgUnits;
				break;
			default:
				type = this.errors.noMatch;
		}
		return type;
	},
	getGameTypeById:
	function getGameTypeById(id){
		var type = {};
		switch(id){
			case 	this.types.strategyQuadrant.id:
				type = this.types.strategyQuadrant;
				break;
			case 	this.types.portersFive.id:
				type = this.types.portersFive;
				break;
			case 	this.types.valueChain.id:
				type = this.types.valueChain;
				break;
			case 	this.types.businessProcess.id:
				type = this.types.businessProcess;
				break;
			case 	this.types.systemsOrgUnits.id:
				type = this.types.systemsOrgUnits;
				break;
			default:
				type = this.errors.noMatch;
		}
		return type;
	}
};
//case data objects
////////////////////////////////GAMEDATA OBJECTS///////////////////

//////////////////////HELPER FUNCTION////////////////
//remove the last part of uri determined by slash "/" 
function getParentUri(string, level){
  var i = (!level)?1:level;
  var p = new RegExp("(\/[^/]+){"+i+"}$","i");
  return string.replace(p,"");
}

//get current case URI
function getCaseUri(){
	return window.casesUris[window.caseIndex];
}

//write game titles 
function loadGameTitle(){
	var strategy = 'Select the strategy that '+ caseData.brandName +' is following.';
	var industryStructure = "Using Porter's Five Forces analyse the industry structure of the "+ caseData.industry + ".";
	var valueChain = 'Choose the three most important value chain activities for '+ caseData.brandName +'.';
	var businessProcesses = "Place the business processes in the correct sequence.";
	var systems = "Assign systems to the appropriate process.";
	
	$('#hype-st-title-ctn').html(strategy);
	$('#hype-pf-title-ctn').html(industryStructure);
	$('#hype-vc-title-ctn').html(valueChain);
	$('#hype-bp-title-ctn').html(businessProcesses);
	$('#hype-so-title-ctn').html(systems);
}

//get url parameters
function replaceLineBreak(string)
{
	return string.replace(/\n/gi,'<br/><br/>')
}

//get url parameters
function getURLParameter(sURL, sParam)
{
	var startIdx = (sURL.indexOf('?') != -1) ? sURL.indexOf('?')+1 : 0;
    var sPageURL = sURL.slice(startIdx);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
	
	//console.log('getURLPara', startIdx, sPageURL, sURLVariables);
}
//////////////////////EOF HELPER FUNCTION////////////////

/* ----------------------------------------------------   document ready  ---------------------------------------------------- */
$(document).ready(function() {  	
/* ----------------------------------------------------  eof document ready  ---------------------------------------------------- */
/////////////////////////UI STRUCTURE//////////////////////

$("#video-popup-dialog").dialog({
	autoOpen: false,
	minWidth: ytPlayerSize.width,
	minHeight: ytPlayerSize.height,
	width: 'auto',
	height: 'auto',
	show: "blind",
	hide: "fade",
	title: "Brand Video",
	modal: true,
	resizable: false,
	open: function(event, ui){
		//console.log("dialogopen: " + event + ui);
		//console.log(caseData.videoLink);
		loadVideoPlayer(caseData.videoLink);
	},
	beforeClose: function(event, ui){
		if(ytPlayer){
			ytPlayer.pauseVideo();
		}
	},
	close: function(event, ui){
		//console.log("dialogclose: " + event + ui);
	},
	dragStart: function (event, ui){
		if(ytPlayer){
			ytPlayer.pauseVideo();
		}
	},
	dragStop: function (event, ui){
		if(ytPlayer){
			ytPlayer.playVideo();
		}
	}
});	

$(".case-logo").click(function() {
	$("#video-popup-dialog").dialog("open");
}).hover(
  function () {
    $(this).toggleClass("hover-fx")
});

$("#strategyQuadrant").hover(
  function () {
    $(this).toggleClass("hover-fx")
  }).click(function() {
	  $("#game-exercise-ctn").toggle( "slide",{direction:"right"},500);
	   HYPE.documents['exerciseModule'].showSceneNamed('strategyQuadrant');
});

$("#portersFive").hover(
  function () {
    $(this).toggleClass("hover-fx")
  }).click(function() {
	  $("#game-exercise-ctn").toggle( "slide",{direction:"right"},500);
	   HYPE.documents['exerciseModule'].showSceneNamed('portersFive');
});

$("#valueChain").hover(
  function () {
    $(this).toggleClass("hover-fx")
  }).click(function() {
	  $("#game-exercise-ctn").toggle( "slide",{direction:"right"},500);
	   HYPE.documents['exerciseModule'].showSceneNamed('valueChain');
});

$("#businessProcess").hover(
  function () {
    $(this).toggleClass("hover-fx")
  }).click(function() {
	  $("#game-exercise-ctn").toggle( "slide",{direction:"right"},500);
	   HYPE.documents['exerciseModule'].showSceneNamed('businessProcess');
});

$("#systemsOrgUnits").hover(
  function () {
    $(this).toggleClass("hover-fx")
  }).click(function() {
		msg = '<div>';
		msg += '<h4> Hah! </h4>';
		msg += '<p> You have to complete the Business Process exercise first! </p>';
		msg += '</div>';


	  $(msg).dialog({
			minWidth: 480,
			modal: true,
			buttons: {
				Ok: function() {
					$( this ).dialog( "close" );
				}
			}
		});		

});

$(".btn-switch").click(function() {
	var currentScene =  HYPE.documents['exerciseModule'].currentSceneName();
	if (window.caseIndex < window.numCases-1) {
		window.caseIndex++
	}else {
		window.caseIndex = 0;
	};
	window.renderStrategyQuestion(session, session.node(getCaseUri()), function() {
	});
	loadGameTitle();
	$(document).data('hypeFailedCount',0);
	$(document).data('hypeFailedHelpFlag', true);
	if(currentScene == 'businessProcess'||currentScene == 'systemsOrgUnits'){
		//HYPE.documents['exerciseModule'].functions().onBPSceneLoad();
		HYPE.documents['exerciseModule'].functions().businessProcessReset();
		HYPE.documents['exerciseModule'].showSceneNamed('businessProcess',HYPE.documents['exerciseModule'].kSceneTransitionPushLeftToRight);
	};
});

$(".btn-next-exercise").click(function() {
/*	
	if(HYPE.documents['exerciseModule'].currentSceneName()=='systemsOrgUnits'){
		HYPE.documents['exerciseModule'].showSceneNamed('strategyQuadrant',HYPE.documents['exerciseModule'].kSceneTransitionSwap);
	}else{
		HYPE.documents['exerciseModule'].showNextScene(HYPE.documents['exerciseModule'].kSceneTransitionSwap);
	};
*/	
	var currentScene =  HYPE.documents['exerciseModule'].currentSceneName();
	if(currentScene == 'businessProcess'){
		 HYPE.documents['exerciseModule'].showSceneNamed('lastScene',HYPE.documents['exerciseModule'].kSceneTransitionSwap);
		 //HYPE.documents['exerciseModule'].showNextScene(HYPE.documents['exerciseModule'].kSceneTransitionSwap);
	}else{
		HYPE.documents['exerciseModule'].showNextScene(HYPE.documents['exerciseModule'].kSceneTransitionSwap);
	};
});

/* Add Event Listeners for HYPE module 
function myCallback(hypeDocument, element, event) {
    // display some data
    //alert("type: " + event.type + hypeDocument.currentSceneName());

    // show the next scene
    $(document).data('hypeMaxSelectedObjects', 3);
	$(document).data('hypeSelectedCount', 0);
	$(document).data('hypeSelectedObjects', new Object());
	console.log(hypeDocument);


    // return false so it does not load the initial scene
    return false;
  }
  
  if("HYPE_eventListeners" in window === false) {
    window.HYPE_eventListeners = Array();
  }
window.HYPE_eventListeners.push({"type":"HypeSceneLoad", "callback":myCallback});
*/


$("#game-exercise-ctn").hide();

$("#game-exercise-ctn .game-exercise-exit").click(function(){
	$("#game-exercise-ctn").toggle( "slide",{direction:"left"},500);
});

$(".exercise-output-msg").hide();

/////////////////////////EOF UI STRUCTURE//////////////////////

/////////////////////////Exercise Games//////////////////////


function loadGameTitleCallback(hypeDocument, element, event) {
	loadGameTitle();
}

if("HYPE_eventListeners" in window === false) {
	window.HYPE_eventListeners = Array();
}

window.HYPE_eventListeners.push({"type":"HypeSceneLoad", "callback":loadGameTitleCallback});
/*
* Strategy Quadrant Game
*/

/*
var 	gameStUI = '<div id="game-st-chart" style="background-image:url(images/strategy_quadrant_bg.png);width:360px;height:360px;position:relative;">';
		gameStUI += '<div id="game-st-focused-low-cost" style="position:absolute;left:65px;bottom:40px"><img src="images/strategy_quadrant_flco.png" alt="focusedLowCost"></div>';
		gameStUI +='<div id="game-st-focused-high-cost" style="position:absolute;right:30px;bottom:40px"><img src="images/strategy_quadrant_fhco.png" alt="focusedHighCost"></div>';
		gameStUI +='<div id="game-st-differentiation" style="position:absolute;right:30px;top:50px"><img src="images/strategy_quadrant_diff.png" alt="differentiation"></div>';
		gameStUI +='<div id="game-st-cost-leadership" style="position:absolute;left:65px;top:50px"><img src="images/strategy_quadrant_clsh.png" alt="costLeadership"></div>';
		gameStUI +='</div>';

		
//$(".exercise-output .exercise-wrapper").html(gameStUI);
$("#game-st-chart").css({
	margin:"auto"
});
$("#game-st-chart img").css({
		cursor: "pointer"})
		.hover(function(){$(this).toggleClass("hover-fx");})
		.click(function(){
		var answer = $(this).attr("alt");
		var msg = "<p>"+answer+"</p>";
		if(answer==gameData.strategyQuadrant.correctStrategy){
			msg = "<div title='Tips'><h2>Well Done!!!</h2>";
			msg += "<h4>Competitive Scope: </h4><p>"+ gameData.strategyQuadrant.competitiveScope +"</p>";
			msg += "<h4>Cost Strategy: </h4><p>"+ gameData.strategyQuadrant.costStrategy +"</p>";
			msg +="</div>";
			
			$(msg).dialog({
				modal: true,
				buttons: {
					Ok: function() {
						$( this ).dialog( "close" );
					}
				}
			});
		}else{
			msg = "<p>Your answer of [ "+answer+" ] is incorrect!</p>";
		
			function callback(){
				$(this).stop().removeAttr("style").fadeOut(3000, "linear");
			};
			$(".exercise-output-msg").html(msg).show(0, callback);
		};
});
*/


/*
* EOF Strategy Quadrant Game
*/


/*
* Porter's Five Game
*/




/*
* EOF Porter's Five Game Game
*/

/////////////////////////EOF Exercise Games//////////////////////
/* ----------------------------------------------------  eof document ready  ---------------------------------------------------- */
});
/* ----------------------------------------------------  eof document ready  ---------------------------------------------------- */
