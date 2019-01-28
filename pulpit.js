$(document).ready(function(){
	fillingGrid('.container');

	var resizeTimer;
	$(window).resize(function(){
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(updatingGrid('.container'), 50);  // setting delay to avoid bugs
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

	$("div.container").on("mousedown","div.full div.picture" , function(event){
		fileDragging(event);
	});

	$("html").on("contextmenu", function(event){
		return false;
	});

	$("div.container").on("contextmenu", "div.full div.picture, div.full p.Ftext", function(event){
		contextMenuHandler(event);
	});

	// $('div.container').on('click', 'div.full div.picture', function(event) {
	// 	event.stopPropagation();
	// 	var parNode = $(this)[0].nextSibling.children[0];
	// 	$( parNode ).css('background-color', '#0E103D').css('color', 'white');
	// 	$('body').on('click', function(){
	// 		$( parNode ).css('background-color', 'inherit').css('color', '#080922');
	// 		$('body').off('click');
	// 	});
	// });

	// $('div.container').on('click', 'div.full p.Ftext', function(event){
	// 	event.stopPropagation();
	// 	var parNode = this;
	// 	$(parNode).css('background-color', '#0E103D').css('color', 'white');
	// 	$('body').on('click', function(){
	// 		$(parNode).css('background-color', 'inherit').css('color', '#080922');
	// 		$('body').off('click');
	// 	});
	// });

	$('div.container').on('click contextmenu', 'div.full div.picture, div.full p.Ftext', function(event){
		var id = null;
		if (event.originalEvent.path[1].id){
			id = event.originalEvent.path[1].id;
		} else if (event.originalEvent.path[2].id) {
			id = event.originalEvent.path[2].id;
		}
		if(highlightData.is){
			unHighlightElement(highlightData.id);
		}
		highlightElement(id);
	});

	$('div.container').on('click','.folder-header i' ,function(event){
		var folder = $( event.originalEvent.path[2] );
		folder.css('display', 'none');
	})

	$('div.container').on('dblclick', 'i.fas.fa-folder', function(event){
		var parNode = $($($(this)[0])[0].parentElement)[0].nextSibling.children[0];
		// console.log(parNode);
		$(parNode).css('background-color', 'inherit').css('color', '#080922');
		if(event.originalEvent.path[2].id) {
			var id = event.originalEvent.path[2].id;
		} else {
			return null;
		}
		if(folders.get(id)){
			folders.get(id).css('display', 'initial');
		} else {
			var folderName = FullItem.allInstances.get(id).name;
			var newFolder = '<div class="folder-container" id="'+ id + 'folder' +'"><div class="folder-header"><p>'+ folderName +'</p><i class="fas fa-times-circle exit-folder"></i></div><div class="folder-grid"></div></div>'
			$('div.container').append(newFolder);
			newFolder = $('.folder-container#'+id+'folder');
			folders.set(id, newFolder);
			fillingGrid('.folder-container#'+id+'folder .folder-grid');
		}
	});

	interact('.folder-container')
	  .draggable({
	  	allowFrom: '.folder-header',
	  	ignoreFrom: 'i',
	    restrict: {
	    	restriction: "parent",
	    	endOnly: false,
	    	elementRect: {
	    		top: 0, left: 0, bottom: 1, right: 1
	    	},
	    },
	    onmove: dragMoveListener
	  })
	  .resizable({
	  	ignoreFrom: 'i',
	    edges: { left: true, right: true, bottom: true, top: false },
	    restrictEdges: {
	      outer: 'parent',
	      endOnly: false,
	    },
	    restrictSize: {
	      min: { width: 330, height: 330 },
	    },
	  })
	  .on('resizemove', resizeMoveListener);
});


var folders = new Map;

class FullItem {
	constructor(type, color, name, containerSelector) {
		this.type = type;
		this.color = color;
		this.name = name;
		this.containerSelector = containerSelector;
		this.identification = firstFreeID('.container');
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


function updatingGrid(containerSelector){
	var container = $(containerSelector)[0];
	var windowHeight = container.clientHeight;
	var windowWidth = container.clientWidth;
	var xItemsNum = Math.floor(windowWidth / 100);
	var yItemsNum = Math.floor(windowHeight / 100);
	var itemsCapacity = xItemsNum * yItemsNum;
	var itemsAlreadyCreated = getNumberOfItems(containerSelector);
	var items = $( containerSelector + " > .item");
	// when screen gets smaller  !!!ERROR WHEN MORE FULL ITEMS THAN THERE IS SPACE IN NEW GRID - solution get those files to new folder
	if(items.length > itemsCapacity){
		var counter = 0;
		var index = items.length - 1; 
		while(counter <= items.length - itemsCapacity - 1) {
			if(!($(items[index]).hasClass("full"))){
				$(items[index]).remove();
				counter++;
			}
			index--;
		}
	}
	// when screen gets bigger
	if(items.length < itemsCapacity){
		fillingGrid(containerSelector);
	}
}

var itemID = 1;
function fillingGrid(containerSelector){
	// console.log(itemID);
	var container = $(containerSelector)[0];
	var windowHeight = container.clientHeight;
	var windowWidth = container.clientWidth;
	var xItemsNum = Math.floor(windowWidth / 100);
	var yItemsNum = Math.floor(windowHeight / 100);
	var itemsCapacity = xItemsNum * yItemsNum;
	var itemsAlreadyCreated = getNumberOfItems(containerSelector);
	for(var i = 0; i< (itemsCapacity - itemsAlreadyCreated); i++) {
		var itemElement = '<div class="item empty" id="x'+ itemID +'"><div class="picture"></div><div class="file-name"></div></div>';
		$(containerSelector).append(itemElement);
		itemID++;
	}
}

function getNumberOfItems(containerSelector){
	var items = $(containerSelector + " > .item");
	return items.length;
}

function firstFreeID(containerSelector) {
	return $(containerSelector + " > .item.empty").first().attr("id");
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
	var newItem = new FullItem(type, color, name, '.container');
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

			// tracking changes in folders organisation
			var icon = pathD[0];
			var isItFolder = $(icon).hasClass('fa-folder');
			var folderHasItsContainer = false;
			if(isItFolder) {
				folderHasItsContainer = folders.has(starterID);
			}


			$("body").on("mouseup", function(upE){
				$("body").off();
				$("body").css("cursor", "");
				var pathU = upE.originalEvent.path;
				var enderID;
				if(pathU[0].id) {
					enderID = pathU[0].id;
				} else if(pathU[1].id){
					enderID = pathU[1].id;
				} else if(pathU[2].id){
					enderID = pathU[2].id;
				}

				// console.log( $( $('.item#'+enderID)[0].parentElement )[0].parentElement.id );
				var folderID;
				try {
					folderID = $( $('.item#'+enderID)[0].parentElement )[0].parentElement.id;
					if(starterID + 'folder' === folderID){
						cursorToNotAllowed();
						return null;
					}
				} catch(error) {
					cursorToNotAllowed();
					return null;
				}

				if(starterID === enderID) {
					return null;
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
				if (folderHasItsContainer) {
					var folder = folders.get(starterID);
					folders.delete(starterID);
					folder.attr('id', enderID + 'folder');
					folders.set(enderID, folder);
				}
			});
		}
	}

	function contextMenuHandler(event) {
		var id = null;
		if (event.originalEvent.path[1].id){
			id = event.originalEvent.path[1].id;
		} else if (event.originalEvent.path[2].id) {
			id = event.originalEvent.path[2].id;
		}
		$(".context-menu").css("top", event.pageY + "px").css("left", event.pageX + "px");
		$("body").on('click', function() {
			$(".context-menu").css("top", "-100px").css("left", "0");
			$("body").off('click');
			$(".context-delete").off('click');
			$(".context-name").off('click');
			// $(".new-name-input button").off('click');
		});
		$(".context-delete").on('click', function(){
			console.log(id);
			var mapItem = FullItem.allInstances.get(id);
			mapItem.itemDeletion();
			FullItem.allInstances.delete(id);
			$(this).off('click');
		});
		$(".context-name").on('click', function(event){

			$('.new-name-input').css('top', event.pageY + 20 +"px").css('left', event.pageX + 10 + "px");
			
			setTimeout(function(){
				$('html').on('click contextmenu', function(event){
					$('.new-name-input').css('top', '-50px').css('left', "0");
					$('html').off('click contextmenu');
					$('.new-name-input button').off('click');
					$('.new-name-input input').val('');
					$('html').on('contextmenu', function(){
						return false;
					});
				});
			} ,30);
			
			$('.new-name-input input').on('click', function(event){
				event.stopPropagation();
			});
			$('.new-name-input button').on('click', function(){
				var newName = $('.new-name-input input').val();
				$('.new-name-input input').val("");
				var mapItem = FullItem.allInstances.get(id);
				mapItem.name = newName;
				mapItem.itemCreation();
				$('.new-name-input').css('top', '-50px').css('left', "0");

				if (folders.has(id)) {
					// console.log(id);
					$(folders.get(id)[0].children[0])[0].children[0].textContent = newName;
				}

				$(this).off('click');
			});
			$(this).off('click');
		});
	}

	function dragMoveListener (event) {
  	var target = event.target;
  	var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  var resizeFolderTimer;
  function resizeMoveListener (event) {
  	var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';
    x += event.deltaRect.left;
    y += event.deltaRect.top;
    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    
    clearTimeout(resizeFolderTimer);
		var folderSelector = $(target).attr('id');
		console.log(folderSelector);
		resizeFolderTimer = setTimeout(updatingGrid('#'+folderSelector+' .folder-grid') ,50);
  }

  var highlightData = {
  	is: false,
  	id: null
  };

  function highlightElement(id) {
  	$( $('.item#'+id)[0].childNodes[1].childNodes[0] ).css('background-color', '#0E103D').css('color', 'white');
  	highlightData.is = true;
  	highlightData.id = id;
  }

  function unHighlightElement(id) {
  	$( $('.item#'+id)[0].childNodes[1].childNodes[0] ).css('background-color', 'inherit').css('color', '#080922');
  	highlightData.is = false;
  	highlightData.id = null;
  }