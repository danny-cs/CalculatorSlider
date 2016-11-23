/*
    -Danny Nguyen
    -danny_nguyen1@student.uml.edu
    -University Of Massachusetts Lowell - 96.161 GUI Programming 1
    -Last updated November 22nd, 2016
    -Description: This .js file implements the function which creates the multiplication table
    and the tabs that store them when the user presses "Submit" and also has a tab 
    which stores the submitted tables seperately and allows for removal of single or 
    multiple tabs.  
*/

// this jquery function handles the case where the max row and column number entered must be greater 
// the minimum row and column number entered
// Also has the rules for the input text which is validated
$(function() {
    $(".btn-remove").click(function() {
        var needsRemove = $("input:checked");
        for (var i = 0; i < needsRemove.length; i++) {
            $("input:checked[value='" + needsRemove[i].value + "']").parent().parent().remove();
            $("#tabs ul li a[href='#tab" + needsRemove[i].value + "']").parent().remove();
            $("#tabs div[id='#tab" + needsRemove[i].value + "']").remove();
        }
    });

    $("#tabs").tabs();

    $.validator.addMethod("greaterThan", function(value, element, param) {
        console.log(value);
        console.log($(element).val())
        var $min = $(param);
        if (isNaN(value)) {
            return true;
        }
        console.log(value + " > " + $min.val());
        return parseInt(value) > parseInt($min.val());
    }, "Max row and column number must be greater than min row and column");

    $("#calculatorForm").validate({
        rules: {
            num1: {
                required: true,
                min: 0,
                digits: true
            },
            num2: {
                required: true,
                greaterThan: "#num1",
                digits: true
            },
            num3: {
                required: true,
                min: 0,
                digits: true
            },
            num4: {
                required: true,
                greaterThan: "#num3",
                digits: true
            }
        },
        //This function creates a new tab whenever the submit button is clicked
        /*This function also includes the tab labled "removeTab" which allows the user
          to remove single or multiple tabs*/  
        submitHandler: function() {
            var num1 = Number(document.forms["calculatorForm"]["num1"].value);
            var num2 = Number(document.forms["calculatorForm"]["num2"].value);
            var num3 = Number(document.forms["calculatorForm"]["num3"].value);
            var num4 = Number(document.forms["calculatorForm"]["num4"].value);
            var num_tabs = $("#tabs ul li").length;
            
            $('a[href="#tab' + (num_tabs - 1) + '"').html(num1 + "," + num2 + "," + num3 + "," + num4);
            $("#tabs ul").append("<li><a href='#tab" + num_tabs + "'>Current</a></li>");
            $("#tabs").append("<div id='tab" + num_tabs + "'><table class='table table-striped'></table></div>");
            $("#tabs").tabs("refresh");
            $("#tabs").tabs("option", "active", num_tabs);
            //  Add to list of tabs to remove
            var table = $("#removeTable").get(0);
            var row = table.insertRow();
            var firstCell = row.insertCell(0);
            firstCell.innerHTML = "Tab " + num_tabs;
            var secondCell = row.insertCell(1);
            secondCell.innerHTML = '<input type="checkbox" name="removeTabs" value="' + num_tabs + '"></input>';
            calculate();
        }
    });
    /* This for loop within the function first allows us to create a slider
        which ues the two-way binding concept to change the input text field
        and the slider location 
    */
    for (var i = 1; i <= 4; i++) {
        $("#num" + i).val(0);
        $("#slider" + i).slider({
            range: "max",
            min: 0,
            max: 10,
            value: 0,
            slide: function(event, ui) {
                $(event.target).parent().find("input").val(ui.value);
                if ($("#calculatorForm").valid()) {
                    calculate();
                }
            }
        });
        $("#num" + i).change(function(event, ui) {
            if ($("#calculatorForm").valid()) {
                calculate();
            }
            $(event.target).parent().find("div").slider("value", $(event.target).val());
        })
    }
});

function calculate() {
    $("table:last").children().remove();
    //creates the place holder for the numbers
    var num1 = Number(document.forms["calculatorForm"]["num1"].value);
    var num2 = Number(document.forms["calculatorForm"]["num2"].value);
    var num3 = Number(document.forms["calculatorForm"]["num3"].value);
    var num4 = Number(document.forms["calculatorForm"]["num4"].value);


    var table = $("table:last").get(0);

    // First row header
    var firstRow = table.insertRow(0);
    // Empty cell
    firstRow.insertCell(0);
    for (var j = 0; j <= (num2 - num1); j++) {
        // Add header titles
        var cell = firstRow.insertCell(j + 1);
        cell.innerHTML = "<p>" + (j + (num1)) + "</p>";
    }
    for (var i = 0; i <= (num4 - num3); i++) {
        var row = table.insertRow(i + 1);
        // Add row title as first cell
        var firstCell = row.insertCell(0);
        firstCell.innerHTML = "<p>" + (i + num3) + "</p>";
        for (var j = 0; j <= (num2 - num1); j++) {
            var cell = row.insertCell(j + 1);
            cell.innerHTML = "<p>" + ((num3 + i) * (num1 + j)) + "</p>";
        }
    }
    return false;
}