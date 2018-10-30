$(document).ready(function(){
	$(window).resize(updatingGrid);

	fillingGrid();
});

function updatingGrid(){
	var windowHeight = window.innerHeight;
	var windowWidth = window.innerWidth;
	
}

function fillingGrid(){
	var windowHeight = window.innerHeight;
	var windowWidth = window.innerWidth;
	var xItemsNum = Math.floor(windowWidth / 100);
	var yItemsNum = Math.floor(windowHeight / 100);
	var itemsCapacity = xItemsNum * yItemsNum;
	var itemsAlreadyCreated = getNumberOfItems();
	for(var i = 0; i< (itemsCapacity - itemsAlreadyCreated); i++) {
		$("#container").append(itemElement);
	}
}

function getNumberOfItems(){
	var items = $(".item");
	return items.length;
}

var itemElement = '<div class="item"><div class="picture"></div><div class="file-name"></div></div>';