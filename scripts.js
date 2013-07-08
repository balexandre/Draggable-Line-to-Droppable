/*
**
** Part of StackOverflow Answer 
**  http://stackoverflow.com/questions/536676/how-to-draw-a-line-between-draggable-and-droppable
**
** Created and Maintained by Bruno Alexandre (balexandre.com) 
**
** GIT REPO at https://github.com/balexandre/Draggable-Line-to-Droppable
**
** Last Edit: 08 July 2013
**
*/

var isDialogOpen = false,
    myLines = [],
    svg = null;
    
// icons
var ico_userNormal  = 'https://github.com/balexandre/Draggable-Line-to-Droppable/raw/master/icons/user-48x48.png',
    ico_userChecked = 'https://github.com/balexandre/Draggable-Line-to-Droppable/raw/master/icons/check-user-48x48.png';

$(document).ready(function () {
  
  // render persons
  renderPersons();

  // initialize & setup everything
  initialize();

});

function initialize() {  
    // set up the drawing area from Body of the document
    //  -30px for the offset...
    $("#svgbasics")
        .css("height", $("#body").height() - 30)
        .css("width", $("#body").width() - 30);

    // Mapping dialog box           
    $("#dialogMappingResult").dialog({
        autoOpen: false,
        modal: true,
        overlay: {
            backgroundColor: '#000',
            opacity: 0.5
        },
        buttons: {
            Close: function () {
                $(this).dialog('close');
            }
        }
    });

    // Reset mappings dialog box
    $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        overlay: {
            backgroundColor: '#000',
            opacity: 0.5
        },
        buttons: {
            Close: function () {
                $(this).dialog('close');
            },
            'Reset mapping': function () {

                // change class and image back to default
                $("div .droppable")
                        .removeClass("ui-state-highlight")
                        .find("img")
                        .removeAttr("src")
                        .attr("src", ico_userNormal);

                // enable the droppable area    
                $("div .droppable").droppable("enable");

                // change class and image back to default
                $("div .draggable")
                        .removeClass("ui-state-highlight")
                        .find("img")
                        .removeAttr("src")
                        .attr("src", ico_userNormal);
                // change icon back to default
                $("div .draggable")
                        .find(".ui-icon-locked")
                        .removeClass("ui-icon-locked")
                        .addClass("ui-icon-shuffle");

                // reset the draggable value
                $("div .draggable")
                        .find("input:hidden")
                        .each(function () {
                           $(this).val( $(this).val().split("_")[0]
                            );
                        });

                // enable the draggable area    
                $("div .draggable").draggable("enable");

                // reset the mapping dialog
                $("#dialogMappingResult")
                        .find("ul")
                        .empty()
                        .append("<li>No mapping was done yet</li>");

                $(this).dialog("close");

                // clear lines
                svgClear();
            }
        }
    });

    // all draggable elements
    $("div .draggable").draggable({
        revert: true,
        snap: false
        /*,helper: "clone"*/
    });

    // all droppable elements
    $("div .droppable").droppable({
        hoverClass: "ui-state-hover",
        helper: "clone",
        cursor: "move",
        drop: function (event, ui) {
            // change class and image
            $(this)
                .addClass("ui-state-highlight")
                .find("img")
                .removeAttr("src")
                .attr("src", ico_userChecked);

            // disable it so it can"t be used anymore       
            $(this).droppable("disable");

            // change class and image of the source elemenet        
            $(ui.draggable)
                .addClass("ui-state-highlight")
                .find("img")
                .removeAttr("src")
                .attr("src", ico_userChecked);

            // change the icon of the source element                
            $(ui.draggable)
                .find(".ui-icon-shuffle")
                .removeClass("ui-icon-shuffle")
                .addClass("ui-icon-locked");

            var sourceValue = $(ui.draggable).find("input:hidden").val();
            var targetValue = $(this).find("input:hidden").val();

            // remove mapping dialog box line if exists
            if ($("#dialogMappingResult").find("ul > li:first").html() == "No mapping was done yet")
                $("#dialogMappingResult").find("ul").empty();

            // append the mapping to the dialog 
            $("#dialogMappingResult")
                .find("ul")
                .append("<li>" + sourceValue + " >> " + targetValue + "</li>");
        
            // change the input element to contain the mapping target and source
            $(ui.draggable)
                .find("input:hidden")
                .val(sourceValue + "_" + targetValue);

            // disable it so it can"t be used anymore   
            $(ui.draggable).draggable("disable");

            svgDrawLine($(this), $(ui.draggable));
        }
    });

    $("#popButton").click(function () {
        $("#dialog").dialog("open");
    });

    $("#getMappings").click(function () {
        $("#dialogMappingResult").dialog("open");
    });

    svg = Raphael("svgbasics", $("#svgbasics").width(), $("#svgbasics").height());
}

function svgClear() {
    svg.clear();
}
function svgDrawLine(eTarget, eSource) {

    // wait 1 sec before draw the lines, so we can get the position of the draggable
    setTimeout(function () {

        var $source = eSource;
        var $target = eTarget;

        // origin -> ending ... from left to right
        // 10 + 10 (padding left + padding right) + 2 + 2 (border left + border right)
        var originX = $source.offset().left + $source.width() + 20 + 4;
        var originY = $source.offset().top + (($source.height() + 20 + 4) / 2);

        var endingX = $target.offset().left;
        var endingY = $target.offset().top + (($target.height() + 20 + 4) / 2);

        var space = 20;
        var color = colours[random(9)];

        // draw lines
        // http://raphaeljs.com/reference.html#path         
        var a = "M" + originX + " " + originY + " L" + (originX + space) + " " + originY; // beginning
        var b = "M" + (originX + space) + " " + originY + " L" + (endingX - space) + " " + endingY; // diagonal line
        var c = "M" + (endingX - space) + " " + endingY + " L" + endingX + " " + endingY; // ending
        var all = a + " " + b + " " + c;

        /**/
        // log (to show in FF (with FireBug), Chrome and Safari)            
        console.log("New Line ----------------------------");
        console.log("originX: " + originX + " | originY: " + originY + " | endingX: " + endingX + " | endingY: " + endingY + " | space: " + space + " | color: " + color );             
        console.log(all); 
        /**/

        // write line
        myLines[myLines.length] = svg
                .path(all)
                .attr({
                   "stroke": color,
                   "stroke-width": 2,
                   "stroke-dasharray": "--."
                });

    }, 1000);

}

function random(range) {
    return Math.floor(Math.random() * range);
}

// Render persons on both sides using JsRender
function renderPersons() {
  console.log('redering left persons...');
  var htmlL = $("#personTemplate").render(leftPersons);
  $("#leftPanel").html(htmlL);
  
  console.log('redering right persons...');
  var htmlR = $("#personTemplate").render(rightPersons);
  $("#rightPanel").html(htmlR);
  
  // give all the correct image
  $(".person img").each(function() { 
    $(this).attr("src", ico_userNormal); });
}

// random colors are not that random after all
var colours = ["purple", "red", "orange", "yellow", "lime", "green", "blue", "navy", "black"];

// list of persons to render
var leftPersons = [
  {id:1, name:'Peter Fagerholm', position:'Developer', cls:'draggable'},
  {id:2, name:'Kjell Öhlén', position:'Manager', cls:'draggable'}
];
var rightPersons = [
  {id:3, name:'Elsa Hallberg', position:'C.E.O.', cls:'droppable'},
  {id:4, name:'Marie Berglund', position:'Recepcionist', cls:'droppable'},
  {id:5, name:'Kjell Öhlén', position:'Manager', cls:'droppable'}
];