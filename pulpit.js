$(document).ready(function(){
	var resizeTimer;
	$(window).resize(function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(updatingGrid, 50);
	});

	fillingGrid();
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