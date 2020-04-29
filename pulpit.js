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
		definedFileID = null;
		definedFolderID = null;
	});

	$("#file-form i").on("click", function(){
		$("#file-form").css("right", "-300px");
		clearingForms();
		definedFileID = null;
		definedFolderID = null;
	});

	$("#add-folder").on("click", function(){
		showingAddFolder();
		definedFileID = null;
		definedFolderID = null;
	});

	$("#folder-form i").on("click", function(){
		$("#folder-form").css("right", "-300px");
		clearingForms();
		definedFileID = null;
		definedFolderID = null;
	});

	var definedFileID = null;
	$("#create-file-button").on("click", function(){
		formItemCreation('file', definedFileID);
	});

	var definedFolderID = null;
	$("#create-folder-button").on("click", function(){
		formItemCreation('folder', definedFolderID);
	});

	$("div.container").on("mousedown","div.full div.picture" , function(event){
		fileDragging(event);
	});

	$("html").on("contextmenu", function(event){
		return false;
	});

	$('div.container').on('contextmenu.addMenu', '.item.empty', function(event){
		var xCoord;
		var yCoord;
		window.innerWidth - event.pageX < 120 ? xCoord = window.innerWidth - 120 : xCoord = event.pageX;
		window.innerHeight - event.pageY < 50 ? yCoord = window.innerHeight - 50 : yCoord = event.pageY;

		$('.context-add-menu').css("top", yCoord + "px").css("left", xCoord + "px");
		var id;
		var pathArr = event.originalEvent.path || event.originalEvent.composedPath();
		if (pathArr.id) {
			id = pathArr.id;
		} else if (pathArr.id) {
			id = pathArr.id;
		}
		$('.context-add-file').off('click');
		$('.context-add-folder').off('click');
		$('div.container').on('click.addMenuRemove', function(){
			$('div.container').trigger("hideAddMenu");
			$('div.container').off('.addMenuRemove');
		});
		$('.context-add-file').on('click', function(event){
			$('div.container').trigger("hideAddMenu");
			$('#add-file').trigger('click');
			definedFileID = id;
		});
		$('.context-add-folder').on('click', function(event){
			$('div.container').trigger("hideAddMenu");
			$('#add-folder').trigger('click');
			definedFolderID = id;
		});
	});

	$('div.container').on('hideAddMenu', function(){
		$('.context-add-menu').css("top", "-100px");
	});

	$("div.container").on("contextmenu", "div.full div.picture, div.full p.Ftext", function(event){
		contextMenuHandler(event);
	});


	$('div.container').on('click contextmenu', 'div.full div.picture, div.full p.Ftext', function(event){
		var id = null;
		var pathArr = event.originalEvent.path || event.originalEvent.composedPath();
		if (pathArr[1].id){
			id = pathArr[1].id;
		} else if (pathArr[2].id) {
			id = pathArr[2].id;
		}
		if(highlightData.is){
			unHighlightElement(highlightData.id);
		}
		highlightElement(id);
	});

	$('html').on("click contextmenu", function(event){
		if(!event.originalEvent){
			return null;
		}
		var pathArr = event.originalEvent.path || event.originalEvent.composedPath();
		var classes = pathArr[0].classList;
		if ( classes.contains('picture') && pathArr[1].classList.contains("full") ) {
			return null;
		} else if ( classes.contains('Ftext') || ( classes.contains('fas') && ( classes.contains('fa-file') || classes.contains('fa-folder') ) ) ) {
			return null;
		} else if ( classes.contains('context-name') ) {
			return null;
		}
		if (highlightData.is) {
			unHighlightElement(highlightData.id);
		}
	});

	$('div.container').on('click','.folder-header i' ,function(event){
		var pathArr = event.originalEvent.path || event.originalEvent.composedPath();
		var folder = $( pathArr[2] );
		folder.css('display', 'none');
	})

	$('div.container').on('click', '.file-header i', function(event){
		var pathArr = event.originalEvent.path || event.originalEvent.composedPath();
		var fileCont = $( pathArr[2] );
		fileCont.css('display', 'none');
	});

	$('div.container').on('dblclick', 'i.fas.fa-folder', function(event){
		showOrCreate(this, event, 'folder', folders);
	});

	$('div.container').on('dblclick', 'i.fas.fa-file', function(event){
		showOrCreate(this, event, 'file', files);
	});

	$('div.container').on('mousedown.zINDEX', '.folder-container, .file-container', function(event){
		applyNewZIndex($(this));
	});

	$('div.container').on('click', '.color-button', function(event){
		var parentEl = this.parentElement;
		$(parentEl.children).removeClass('CBACTIVE');
		this.classList.add('CBACTIVE');
		var dataColor = this.getAttribute('data-color');
		var dataCanvasID = this.getAttribute('data-canvasID');
		dataCanvasID = 'canvas' + dataCanvasID;
		document.getElementById(dataCanvasID).getContext('2d').strokeStyle = dataColor;
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

		interact('.file-container')
	  .draggable({
	  	allowFrom: '.file-header',
	  	ignoreFrom: 'i',
	    restrict: {
	    	restriction: "parent",
	    	endOnly: false,
	    	elementRect: {
	    		top: 0, left: 0, bottom: 1, right: 1
	    	},
	    },
	    onmove: dragMoveListener
	  });
});

var canvasID = 1;
var files = new Map;
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
		if(!item[0]) {
			cursorToNotAllowed();
			return null;
		}
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

function formItemCreation(type, id) {
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
	if (id) {
		newItem.identification = id;
	}
	FullItem.allInstances.set(newItem.identification, newItem);
	newItem.itemCreation();
	$("#"+ type +"-form").css("right", "-300px");
	clearingForms();
	id = newItem.identification;
	if(type === 'folder') {
		var folderName = FullItem.allInstances.get(id).name;
		var newFolder = '<div class="folder-container" id="'+ id + 'folder' +'"><div class="folder-header"><p>'+ folderName +'</p><i class="fas fa-times-circle exit-folder"></i></div><div class="folder-grid"></div></div>'
		$('div.container').append(newFolder);
		newFolder = $('.folder-container#'+id+'folder');
		folders.set(id, newFolder);
		fillingGrid('.folder-container#'+id+'folder .folder-grid');
		newFolder.css('display', 'none');
	}
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
			var pathD = downE.originalEvent.path || downE.originalEvent.composedPath();
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

			// tracking changes in files organisation
			var isItFile = $(icon).hasClass('fa-file');
			var fileHasItsContainer = false;
			if(isItFile) {
				fileHasItsContainer = files.has(starterID);
			}

			// tracking changes in highlightment
			if(highlightData.is && highlightData.id !== starterID){
				unHighlightElement(highlightData.id);
			}

			$("body").on("mouseup", function(upE){
				$("body").off("mouseup");
				$("body").css("cursor", "");
				var pathU = upE.originalEvent.path || upE.originalEvent.composedPath();
				var enderID;
				if(pathU[0].id) {
					enderID = pathU[0].id;
				} else if(pathU[1].id){
					enderID = pathU[1].id;
				} else if(pathU[2].id){
					enderID = pathU[2].id;
				}

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
				if (folders.has(enderID)) {
					var newID = firstFreeID("#"+enderID+"folder .folder-grid");
					if(newID){
						itemNewPlace(starterID, newID, folderHasItsContainer, fileHasItsContainer);
						return null;
					} else {
						cursorToNotAllowed();
						return null;
					}
				}
				if(enderID === undefined || FullItem.allInstances.has(enderID) || enderID.split("")[0] !== "x"){
					cursorToNotAllowed();
					return null;
				}
				itemNewPlace(starterID, enderID, folderHasItsContainer, fileHasItsContainer);
				highlightElement(enderID);
			});
		}
	}

	function contextMenuHandler(event) {
		var id = null;
		var pathArr = event.originalEvent.path || event.originalEvent.composedPath();
		if (pathArr[1].id){
			id = pathArr[1].id;
		} else if (pathArr[2].id) {
			id = pathArr[2].id;
		}
		$(".context-delete").off('click');
		$(".context-name").off('click');
		$(".context-menu").css("top", event.pageY + "px").css("left", event.pageX + "px");
		$('div.container').trigger("hideAddMenu");
		$("div.container").on('click.hideContextMenu contextmenu.hideContextMenu', function() {
			$(".context-menu").css("top", "-100px").css("left", "0");
			$("div.container").off('.hideContextMenu');
			$(".context-delete").off('click');
			$(".context-name").off('click');
		});
		$(".context-delete").on('click', function(){
			var mapItem = FullItem.allInstances.get(id);
			if(mapItem.type === 'folder') {
				var folderToDelete = folders.get(id);
				$(folderToDelete).remove();
				folders.delete(id);
			} else {
				var fileContToDelete = files.get(id);
				$(fileContToDelete).remove();
				files.delete(id);
			}
			mapItem.itemDeletion();
			FullItem.allInstances.delete(id);
			$(this).off('click');
		});
		$(".context-name").on('click', function(event){

			$('.new-name-input').css('top', event.pageY + 20 +"px").css('left', event.pageX + 10 + "px");
			
			setTimeout(function(){
				$('html').on('click.hideInput contextmenu.hideInput', function(event){
					$('.new-name-input').css('top', '-50px').css('left', "0");
					$('html').off('.hideInput');
					$('.new-name-input button').off('click');
					$('.new-name-input input').val('');
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
					$(folders.get(id)[0].children[0])[0].children[0].textContent = newName;
				} else if (files.has(id)) {
					$(files.get(id)[0].children[0])[0].children[0].textContent = newName;
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

  function itemNewPlace(starterID, enderID, folderHasItsContainer, fileHasItsContainer) {
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
				} else if (fileHasItsContainer) {
					var fileCont = files.get(starterID);
					files.delete(starterID);
					fileCont.attr('id', enderID + 'file');
					files.set(enderID, fileCont);
				}
  }

  var zIndex = 10;

  function applyNewZIndex (JQfolderContainer) {
  	JQfolderContainer.css('z-index', zIndex.toString());
  	zIndex++;
  }

  function addClick(x, y, xArr, yArr, dragArr, dragging) {
		xArr.push(x);
		yArr.push(y);
		dragArr.push(dragging);
	}

	function redraw(xArr, yArr, dragArr, contextA) {
		for (var i=0; i < xArr.length; i++) {
			contextA.beginPath();
			if( dragArr[i] && i ) { // jeśli pierwszy punkt albo tylko klikniecie
				contextA.moveTo(xArr[i-1], yArr[i-1]);
			} else { // jeśli draggin
				contextA.moveTo(xArr[i] - 1, yArr[i]);
			}
			contextA.lineTo(xArr[i], yArr[i]);
			contextA.closePath();
			contextA.stroke();
		}
	}

	function canvasInteraction (canvasID) {
		var context = document.getElementById(canvasID).getContext('2d');

		context.strokeStyle = "#333676";
		context.lineJoin = "round";
		context.lineWidth = 5;

		var clickX = new Array();
		var clickY = new Array();
		var clickDrag = new Array();

		var paint = false;

		$('#' + canvasID).mousedown(function(event){
			event.preventDefault();
			var translateX = 0;
			var translateY = 0;
			var dataSet = $($(this)[0].offsetParent)[0].dataset;
			if( dataSet.x ){
				translateX = parseInt(dataSet.x);
				translateY = parseInt(dataSet.y);
			}
			var mouseX = event.pageX - ($(this)[0].offsetParent.offsetLeft + translateX);
			var mouseY = event.pageY - ($(this)[0].offsetParent.offsetTop + this.offsetTop + translateY);

			paint = true;
			addClick(mouseX, mouseY, clickX, clickY, clickDrag, null);
			redraw(clickX, clickY, clickDrag, context);
		});

		$('#' + canvasID).mousemove(function(event){
			var translateX = 0;
			var translateY = 0;
			var dataSet = $($(this)[0].offsetParent)[0].dataset;
			if( dataSet.x ){
				translateX = parseInt(dataSet.x);
				translateY = parseInt(dataSet.y);
			}
			var mouseX = event.pageX - ($(this)[0].offsetParent.offsetLeft + translateX);
			var mouseY = event.pageY - ($(this)[0].offsetParent.offsetTop + this.offsetTop + translateY);

			if (paint) {
				addClick(mouseX, mouseY, clickX, clickY, clickDrag, true);
				redraw(clickX, clickY, clickDrag, context);
			}
		});

		$('#' + canvasID).mouseup(function(){
			clickX = new Array();
			clickY = new Array();
			clickDrag = new Array();
			paint = false;
		});

		$('#' + canvasID).mouseleave(function(){
			paint = false;
			clickX = new Array();
			clickY = new Array();
			clickDrag = new Array();
		});
}

function showOrCreate (thisA, eventA, type, map) {
	var parNode = $($($(thisA)[0])[0].parentElement)[0].nextSibling.children[0];
	$(parNode).css('background-color', 'inherit').css('color', '#080922');
	var pathArr = eventA.originalEvent.path || eventA.originalEvent.composedPath();
	if(pathArr[2].id) {
		var id = pathArr[2].id;
	} else {
		return null;
	}
	if(map.get(id)){   // map = folders
		applyNewZIndex( map.get(id) );
		map.get(id).css('display', 'initial');
	} else {
		var name = FullItem.allInstances.get(id).name;
		if(type === 'folder') {
			var newContainer = createFolderHTML(id, name);
		} else if (type === 'file') {
			var newContainer = createFileHTML(id, name);
		}
		$('div.container').append(newContainer);
		newContainer = $('.'+type+'-container#'+id+type);
		map.set(id, newContainer);
		if(type === 'folder') {
			fillingGrid('.folder-container#'+id+'folder .folder-grid');
		} else if (type === 'file') {
			canvasInteraction('canvas' + canvasID);
			canvasID+=1;
		}
	}
}

function createFolderHTML (id, name) {
	return '<div class="folder-container" id="'+ id + 'folder' +'"><div class="folder-header"><p>'+ name +'</p><i class="fas fa-times-circle exit-folder"></i></div><div class="folder-grid"></div></div>';
}

function createFileHTML (id, name) {
	return '<div class="file-container" id="'+ id + 'file' +'"><div class="file-header"><p>'+ name +'</p><i class="fas fa-times-circle exit-file"></i></div><div class="color-button CB1 CBACTIVE" data-color="#333676" data-canvasID="'+ canvasID +'"></div><div class="color-button CB2" data-color="#c56e00" data-canvasID="'+ canvasID +'"></div><div class="color-button CB3" data-color="#979f00" data-canvasID="'+ canvasID +'"></div><canvas width="326" height="308" id="'+ 'canvas' + canvasID +'"></canvas></div>';
}