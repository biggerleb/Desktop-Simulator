$(document).ready(function(){
	fillingGrid();

	var resizeTimer;
	$(window).resize(function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(updatingGrid, 50);  // setting delay to avoid bugs
	});

	var rotVar = 180;
	$("#arrow-container").on("click", function(){
		rotVar = togglingArrowContainer(rotVar, this); //a littile hack with keeping track of rotVar
	});

	$("#add-file").on("click", function(){
		showingAddFile();
	});

	$("#file-form i").on("click", function(){
		$("#file-form").css("right", "-300px");
		clearingForms();
	});

	$("#add-folder").on("click", function(){
		showingAddFolder();
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

	$("div.container").on("mousedown","div.full div.picture" , fileDragging);

	$("html").on("contextmenu", function(event){
		return false;
	});

	$("div.container").on("contextmenu", "div.full div.picture, div.full p.Ftext", function(event){
		var id = null;
		if (event.originalEvent.path[1].id){
			id = event.originalEvent.path[1].id;
		} else if (event.originalEvent.path[2].id) {
			id = event.originalEvent.path[2].id;
		}
		console.log(id);
		$(".context-menu").css("top", event.pageY + "px").css("left", event.pageX + "px");
		$("body").on('click', function() {
			$(".context-menu").css("top", "-100px").css("left", "0");
			$("body").off('click');
		});
		$(".context-delete").on('click', function(){
			var mapItem = FullItem.allInstances.get(id);
			console.log(id);
			mapItem.itemDeletion();
			FullItem.allInstances.delete(id);
			$(this).off('click');
		});
		$(".context-name").on('click', function(){
			$('.new-name-input').css('top', event.pageY + 20 +"px").css('left', event.pageX + 10 + "px");
			setTimeout(function(){
				$('body').on('click', function(){
					$('.new-name-input').css('top', '-50px').css('left', "0");
					$('body').off('click');
				});
			}, 100);
			$('.new-name-input input').on('click', function(event){
				event.stopPropagation();
				$(this).off('click');
			});
			$('.new-name-input button').on('click', function(){
				var newName = $('.new-name-input input').val();
				var mapItem = FullItem.allInstances.get(id);
				console.log(id);
				mapItem.name = newName;
				mapItem.itemCreation();
				$(this).off('click');
			});
			$(this).off('click');
		});
	});
});



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
	itemDeletion() {
		var item = $(".item#" + this.identification);
		item[0].childNodes[0].innerHTML = "";
		item[0].childNodes[1].innerHTML = "";
		item.removeClass("full");
		item.addClass("empty");
	}
}

FullItem.allInstances = new Map;


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

function togglingArrowContainer (rotVar, thisAA)  {
	if(!($(thisAA).hasClass("hide"))){
			$("#menu").css("top", "0");
			$(thisAA).css("border-radius", "0");
			$(thisAA).addClass("hide");
			$("#arrow-container i").css("transform", "rotate("+ rotVar +"deg)");
			rotVar += 180;
		} else {
			$("#menu").css("top", "-40px");
			$(thisAA).css("border-radius", "50%");
			$(thisAA).removeClass("hide");
			$("#arrow-container i").css("transform", "rotate("+ rotVar +"deg)");
			rotVar += 180;
		}
	return rotVar;
}

function showingAddFile() {
	if( $("#folder-form").css("right")==="-300px" ) {
		$("#file-form").css("right", "0");
	} else {
		$("#folder-form").css("right", "-300px");
		clearingForms();
		setTimeout(function() {
			$("#file-form").css("right", "0");
			$("#folder-form").css("right", "-300px");
		}, 500);
	}
}

function showingAddFolder() {
		if( $("#file-form").css("right")==="-300px" ) {
			$("#folder-form").css("right", "0");
		} else {
			$("#file-form").css("right", "-300px");
			clearingForms();
			setTimeout(function(){
				$("#folder-form").css("right", "0");
				$("#file-form").css("right", "-300px");
			}, 500);
		}
}

function cursorToNotAllowed () {
	$("body").css("cursor", "not-allowed");
	setTimeout(function(){
		$("body").css("cursor", "default");
	}, 500);
}

function fileDragging(downE){
		if (downE.button === 0) {
			downE.preventDefault();
			$(".context-menu").css("top", "-100px").css("left", "0");
			$("body").css("cursor", "grab");
			var pathD = downE.originalEvent.path;
			var starterID;
			if(pathD[1].id) {
				starterID = pathD[1].id;
			} else if(pathD[2].id){
				starterID = pathD[2].id;
			}

			$("body").on("mouseup", function(upE){
				$("body").off();
				$("body").css("cursor", "default");
				var pathU = upE.originalEvent.path;
				var enderID;
				if(pathU[0].id) {
					enderID = pathU[0].id;
				} else if(pathU[1].id){
					enderID = pathU[1].id;
				} else if(pathU[2].id){
					enderID = pathU[2].id;
				}
				if(enderID === undefined || FullItem.allInstances.has(enderID) || enderID.split("")[0] !== "x"){
					cursorToNotAllowed();
					return null;
				}
				var mapItem = FullItem.allInstances.get(starterID);
				mapItem.itemDeletion();
				mapItem.identification = enderID;
				mapItem.itemCreation();
			  FullItem.allInstances.delete(starterID);
				FullItem.allInstances.set(enderID, mapItem);	
			});
		}
	}