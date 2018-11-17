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
			var timer = setTimeout(function() {
				$("#file-form").css("right", "0");
			}, 500);
		}
	});

	$("#file-form i").on("click", function(){
		$("#file-form").css("right", "-300px");
	});

	$("#add-folder").on("click", function(){
		if( $("#file-form").css("right")==="-300px" ) {
			$("#folder-form").css("right", "0");
		} else {
			$("#file-form").css("right", "-300px");
			var timer = setTimeout(function(){
				$("#folder-form").css("right", "0");
			}, 500);
		}
	});

	$("#folder-form i").on("click", function(){
		$("#folder-form").css("right", "-300px");
	});

	$("#create-file-button").on("click", function(){
		// this.id
		// $('input[type="radio"]:checked').val() ); undefined
		var errorCount = 0;
		if($('input[name="file-name"]').val().length === 0) {
			$('#file-form .create-name p').css("color", "#ff7c63");
			errorCount++;
		} else {
			$('#file-form .create-name p').css("color", "white");
		}
		if($('input[name="file-color"]:checked').val() === undefined) {
			$('#file-form .color-div').addClass('color-error');
			errorCount++;
		} else {
			$('#file-form .color-div').removeClass('color-error');
		}
		if(errorCount > 0) {
			return;
		}
		console.log("going forward"); // tu skonczylem
	})
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
		$("#container").append(itemElement);
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