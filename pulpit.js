$(document).ready(function(){
	fillingGrid();

	var resizeTimer;
	$(window).resize(function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(updatingGrid, 50);  // setting delay to avoid bugs
	});

	var rotVar = 180;
	$("#arrow-container").on("click", function(){
		if(!($(this).hasClass("hide"))){
			$("#menu").css("top", "0");
			$(this).css("border-radius", "0");
			$(this).addClass("hide");
			$("#arrow-container i").css("transform", "rotate("+ rotVar +"deg)");
			rotVar += 180;
		} else {
			$("#menu").css("top", "-40px");
			$(this).css("border-radius", "50%");
			$(this).removeClass("hide");
			$("#arrow-container i").css("transform", "rotate("+ rotVar +"deg)");
			rotVar += 180;
		}
	});

	$("#add-file").on("click", function(){
		if( $("#folder-form").css("right")==="-300px" ) {
			$("#file-form").css("right", "0");
		} else {
			$("#folder-form").css("right", "-300px");
			clearingForms();
			var timer = setTimeout(function() {
				$("#file-form").css("right", "0");
			}, 500);
		}
	});

	$("#file-form i").on("click", function(){
		$("#file-form").css("right", "-300px");
		clearingForms();
	});

	$("#add-folder").on("click", function(){
		if( $("#file-form").css("right")==="-300px" ) {
			$("#folder-form").css("right", "0");
		} else {
			$("#file-form").css("right", "-300px");
			clearingForms();
			var timer = setTimeout(function(){
				$("#folder-form").css("right", "0");
			}, 500);
		}
	});

	$("#folder-form i").on("click", function(){
		$("#folder-form").css("right", "-300px");
		clearingForms();
	});

	$("#create-file-button").on("click", function(){
		formItemCreation('file');
	});

	$("#create-folder-button").on("click", function(){
		formItemCreation('folder');
	});

	$("div.container").on("mousedown","div.full div.picture" ,function(downE){
		downE.preventDefault();
		$("body").css("cursor", "grab");
		var pathD = downE.originalEvent.path;
		var starterID;
		if(pathD[1].id) {
			starterID = pathD[1].id;
		} else if(pathD[2].id){
			starterID = pathD[2].id;
		}
		console.log(starterID);


		$("body").on("mouseup", function(upE){
			$("body").off();
			$("body").css("cursor", "default");
			var pathU = upE.originalEvent.path;
			var enderID;
			if(pathU[0].id) {
				enderID = pathU[0].id;
			} else if(pathU[1].id){
				enderID = pathU[1].id;
			}
			console.log(enderID);
		});
	});
});



function updatingGrid(){
	var windowHeight = window.innerHeight;
	var windowWidth = window.innerWidth;
	var xItemsNum = Math.floor(windowWidth / 100);
	var yItemsNum = Math.floor(windowHeight / 100);
	var itemsCapacity = xItemsNum * yItemsNum;
	var itemsAlreadyCreated = getNumberOfItems();
	var items = $(".item");
	// when screen gets smaller  !!!ERROR WHEN MORE FULL ITEMS THAN THERE IS SPACE IN NEW GRID - solution get those files to new folder
	if(items.length > itemsCapacity){
		var counter = 0;
		var index = items.length - 1; 
		while(counter <= items.length - itemsCapacity - 1) {
			if(!($(items[index]).hasClass("full"))){
				$(items[index]).remove();
				counter++;
				index--;
			}
		}
	}
	// when screen gets bigger
	if(items.length < itemsCapacity){
		fillingGrid();
	}
}

var itemID = 1;
function fillingGrid(){
	var windowHeight = window.innerHeight;
	var windowWidth = window.innerWidth;
	var xItemsNum = Math.floor(windowWidth / 100);
	var yItemsNum = Math.floor(windowHeight / 100);
	var itemsCapacity = xItemsNum * yItemsNum;
	var itemsAlreadyCreated = getNumberOfItems();
	for(var i = 0; i< (itemsCapacity - itemsAlreadyCreated); i++) {
		var itemElement = '<div class="item empty" id="x'+ itemID +'"><div class="picture"></div><div class="file-name"></div></div>';
		$(".container").append(itemElement);
		itemID++;
	}
}

function getNumberOfItems(){
	var items = $(".item");
	return items.length;
}

class FullItem {
	constructor(type, color, name) {
		this.type = type;
		this.color = color;
		this.name = name;
		this.identification = firstFreeID();
	}
	itemCreation() {
		var item = $(".item#" + this.identification);
		var pictureInsert = '<i class="fas fa-'+ this.type +' icon-'+ this.color +'"></i>';
		var textInsert = '<p class="Ftext">'+ this.name +'</p>';
		item[0].children[0].innerHTML = pictureInsert;
		item[0].children[1].innerHTML = textInsert;
		item.removeClass("empty");
		item.addClass("full");
	}
}
FullItem.allInstances = new Map;

function firstFreeID() {
	return $(".item.empty").first().attr("id");
}

function clearingForms() {
	var timer = setTimeout(function(){
		$('input[type="text"]').val("");
		$('input[type="radio"]').prop("checked", false);
		$('.create-name p').css("color", "white");
		$('.color-div').removeClass('color-error');
		$('.word-error').css('display', 'none');
	},500);
}

function formItemCreation(type) {
	var errorCount = 0;
	if($('input[name="'+ type +'-name"]').val().length === 0) {
		$('#'+ type +'-form .create-name p').css("color", "#ff7c63");
		errorCount++;
	} else {
		$('#'+ type +'-form .create-name p').css("color", "white");
	}
	if($('input[name="'+ type +'-color"]:checked').val() === undefined) {
		$('#'+ type +'-form .color-div').addClass('color-error');
		errorCount++;
	} else {
		$('#'+ type +'-form .color-div').removeClass('color-error');
	}
	if(isWordError(type)) {
		$('#'+ type +'-form .word-error').css('display', 'block');
		$('#'+ type +'-form .create-name p').css("color", "#ff7c63");
		errorCount++;
	} else {
		$('#'+ type +'-form .word-error').css('display', 'none');
	}
	if(errorCount > 0) {
		return;
	}
	var name = $('input[name="'+ type +'-name"]').val();
	var color = $('input[name="'+ type +'-color"]:checked').val();
	var newItem = new FullItem(type, color, name);
	FullItem.allInstances.set(newItem.identification, newItem);
	newItem.itemCreation();
	$("#"+ type +"-form").css("right", "-300px");
	clearingForms();
}

function isWordError(type) {
	var itemName = $('input[name="'+ type +'-name"]').val();
	var itemNameArray = itemName.split(" ");
	for(var i = 0; i < itemNameArray.length; i++){
		if(itemNameArray[i].length > 14){
			return true;
		}
	}
	return false;
}