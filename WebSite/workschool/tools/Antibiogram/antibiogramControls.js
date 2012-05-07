/**
 * Copyright 2012, Jonathan H. Chen (jonc101 at gmail.com / jonc101 at stanford.edu)
 *
 */
// Depends on toolkit.js, Color.js, antibiogramData.js

// Color extremes to represent positive vs. negative sensitivity
var SENSITIVITY_COLOR_POSITIVE = new Color('#00ff00');
var SENSITIVITY_COLOR_MODERATE = new Color('#ffff00');
var SENSITIVITY_COLOR_NEGATIVE = new Color('#ff0000');
var SENSITIVITY_COLOR_UNKNOWN = new Color('#f0f0f0');

/**
 * Function called on page load to initialize visualized / selected data
 */
function initialize(theForm)
{
    updateBugList(theForm);
    updateDrugList(theForm);

    // Also reset the data load field to default data
    loadSensitivityData( theForm.dataLoad, "default", true );
}

/**
 * Quick clear / reset option for user to wipe out prior selections
 */
function clearSelectedBugs()
{
    var theForm = document.forms[0];
    theForm.bugSelected.options.length = 0;
    updateBugList(theForm);
}
function clearSelectedDrugs()
{
    var theForm = document.forms[0];
    theForm.drugSelected.options.length = 0;
    updateDrugList(theForm);
}

/**
 * Reset the available and selected bug lists to match any category selections
 */
function updateBugList(theForm)
{
    var availableField = theForm.bugAvailable;
    var selectedField = theForm.bugSelected;

    var bugPropField = theForm.bugProp;

    // Build quick lookup dictionary on which bug properties are selected
    var bugPropSelectionDict = {};
    var numPropSelected = 0;
    for( var i=0; i < bugPropField.length; i++ )
    {
        bugPropSelectionDict[bugPropField[i].value] = bugPropField[i].checked;
        if ( bugPropField[i].checked ) { numPropSelected++; }
    }

    // Eliminate any prior data
    availableField.options.length = 0;
    //selectedField.options.length = 0;

    // Build up filtered list of items
    var filteredList = new Array();

    for( var i=0; i < BUG_LIST.length; i++ )
    {
        var name = BUG_LIST[i];

        // Only display items for which sensitivity data is available
        if ( name in SENSITIVITY_TABLE_BY_BUG )
        {
            // If any of this bug's properties are in the checked list or no specific one selected, then include it in the available list
            var bugPropList = PROPERTIES_BY_BUG[name];
            if ( numPropSelected == 0 ) { filteredList.push(name); }
            else
            {
                for( var j=0; j < bugPropList.length; j++ )
                {
                    var bugProp = bugPropList[j]
                    if ( bugPropSelectionDict[bugProp] )
                    {   // If within one of the checked drug classes, then initiate in selected list instead
                        filteredList.push(name);
                        break;  // No need to check further properties
                    }
                }
            }
        }
    }

    // Now actually produce the data in sorted in order
    filteredList.sort();
    for( var i=0; i < filteredList.length; i++ )
    {
        var name = filteredList[i];
        availableField.options.add( new Option(name, name) );
        //selectedField.options.add( new Option(name, name) );
    }
}

/**
 * Reset the available and selected drug lists to match any category selections
 */
function updateDrugList(theForm)
{
    var availableField = theForm.drugAvailable;
    var selectedField = theForm.drugSelected;

    var drugPropField = theForm.drugProp;

    // Build quick lookup dictionary on which drug classes are selected
    var drugPropSelectionDict = {};
    var numPropSelected = 0;
    for( var i=0; i < drugPropField.length; i++ )
    {
        drugPropSelectionDict[drugPropField[i].value] = drugPropField[i].checked;
        if ( drugPropField[i].checked ) { numPropSelected++; }
    }

    // Build quick lookup dictionary on which drugs actually have sensitivity data available
    var drugAvailableDict = {};
    for( var bug in SENSITIVITY_TABLE_BY_BUG )
    {
        var sensitivityPerDrug = SENSITIVITY_TABLE_BY_BUG[bug];
        for( var drug in sensitivityPerDrug )
        {
            drugAvailableDict[drug] = true;
        }
    }

    // Eliminate any prior data
    availableField.options.length = 0;
    //selectedField.options.length = 0;

    // Build up filtered list of items
    var filteredList = new Array();

    for( var i=0; i < DRUG_LIST.length; i++ )
    {
        var name = DRUG_LIST[i];

        // Only display the drug if sensitivity data is available
        if ( name in drugAvailableDict )
        {
            // If any of the properties are in the checked list or no specific one selected, then include it in the available list
            var drugPropList = PROPERTIES_BY_DRUG[name];
            if ( numPropSelected == 0 ) { filteredList.push(name); }
            else
            {   // If any of this drug's properties are in the checked list, then include it in the available list
                for( var j=0; j < drugPropList.length; j++ )
                {
                    var drugProp = drugPropList[j]
                    if ( drugPropSelectionDict[drugProp] )
                    {   // If within one of the checked drug classes, then initiate in selected list instead
                        filteredList.push(name);
                        break;  // No need to check further properties
                    }
                }
            }
        }
    }

    // Now actually produce the data in sorted in order
    filteredList.sort();
    for( var i=0; i < filteredList.length; i++ )
    {
        var name = filteredList[i];
        availableField.options.add( new Option(name, name) );
        //selectedField.options.add( new Option(name, name) );
    }
}

/**
 * Convenience function.  If user clicks on Bug property name,
 *  have that be equivalent to clicking on the checkbox (but gives user a bigger mouse target to aim for)
 */
function toggleBugProp(bugProp)
{
    var theForm = document.forms[0];
    var bugPropField = theForm.bugProp;

    for( var i=0; i < bugPropField.length; i++ )
    {
        if ( bugPropField[i].value == bugProp )
        {
            bugPropField[i].click();  // Simulate the click
            break;  // Do not need to check further
        }
    }
}

/**
 * Convenience function.  If user clicks on drug class name,
 *  have that be equivalent to clicking on the checkbox (but gives user a bigger mouse target to aim for)
 */
function toggleDrugProp(drugProp)
{
    var theForm = document.forms[0];
    var drugPropField = theForm.drugProp;

    for( var i=0; i < drugPropField.length; i++ )
    {
        if ( drugPropField[i].value == drugProp )
        {
            drugPropField[i].click();  // Simulate the click
            break;  // Do not need to check further
        }
    }
}

/**
 * Top level function to analyze the situation
 */
function doAnalysis(theForm)
{
    reset();    // Reset the feedback field to blank

    // Ensure at least some selections to work with
    var availableField = theForm.bugAvailable;
    var selectedField = theForm.bugSelected;
    if ( selectedField.options.length == 0 )
    {   // None selected, then just auto-select over all available
        selectAllList(availableField, true);
        selectMoveCopy( availableField, selectedField, true );
    }

    var availableField = theForm.drugAvailable;
    var selectedField = theForm.drugSelected;
    if ( selectedField.options.length == 0 )
    {   // None selected, then just auto-select over all available
        selectAllList(availableField, true);
        selectMoveCopy( availableField, selectedField, true );
    }

    document.all['sensitivityTableSpace'].innerHTML = generateSensitivityTableHTML(theForm);
    //printSensitivityTable(theForm);
}

function printSensitivityTable(theForm)
{
    var bugListField = theForm.bugSelected;
    var drugListField = theForm.drugSelected;

    for( var i=0; i < bugListField.options.length; i++ )
    {
        var bug = bugListField.options[i].value;
        if ( bug in SENSITIVITY_TABLE_BY_BUG )
        {
            var sensTable = SENSITIVITY_TABLE_BY_BUG[bug];
            for( var j=0; j < drugListField.options.length; j++ )
            {
                var drug = drugListField.options[j].value;
                var sensValue = sensTable[drug];
                if ( !sensValue && sensValue != 0 ) { sensValue = '?'; }
                print( sensValue );
                print(' ');
            }
            println(bug);
        }
    }
}

function generateSensitivityTableHTML(theForm)
{
    var tableHTML = new Array();

    tableHTML.push('<table border=0 cellpadding=2 cellspacing=2>');

    var bugListField = theForm.bugSelected;
    var drugListField = theForm.drugSelected;

    // Associative array to collect cumulative / aggregate data on each column of drug information
    //  In particular, looking for the worst case scenario of poor / min sensitivity
    var minSensPerDrug = new Array();
    var maxSensPerBug = new Array();   // Similarly for bug, but account for max case, if use all selected drugs, accept best sensitivity
    var minOfMaxForAllDrugs = null; // Final aggregate statistics.  Take the minimum of all max effects for each drug to see the worst case sensitivity if treated all selected drugs

    var totalNumTested = null;

    var numTestedPlaceholderIndex = -1;
    var rowPlaceholderIndex = -1;   // Index of a column stat placeholder element to aggregate

    tableHTML.push('<tr valign=bottom>');
    tableHTML.push('<th class="headerRow">Microbe</th>');
    tableHTML.push('<th class="headerRow">Isolates Tested</th>');
    tableHTML.push('<th class="headerRow">ALL DRUGS</th>');
    for( var j=0; j < drugListField.options.length; j++ )
    {
        var drug = drugListField.options[j].text;
        var drugFormatted = formatHeader(drug);
        tableHTML.push('<th class="headerRow">'+drugFormatted+'</th>');

        minSensPerDrug[drug] = null;    // Start as unknown
    }
    tableHTML.push('</tr>');

    tableHTML.push('<tr valign=middle>');
    tableHTML.push('<td align=center class="headercol">ALL BUGS</td>');
    tableHTML.push('***PLACEHOLDER for total isolates tested data***');
    numTestedPlaceholderIndex = (tableHTML.length - 1);
    tableHTML.push('***MIN DRUG SENSITIVITY PLACEHOLDER***');  // Put a placeholder element that will be overwritten when aggregate column stats
    rowPlaceholderIndex = (tableHTML.length - 1);
    tableHTML.push('</tr>');

    for( var i=0; i < bugListField.options.length; i++ )
    {
        var bug = bugListField.options[i].value;
        var colPlaceholderIndex = -1;  // Index of a row stat placeholder element to aggregate

        maxSensPerBug[bug] = null;  // Start as unknown

        var sensTable = {};
        if ( bug in SENSITIVITY_TABLE_BY_BUG )
        {
            sensTable = SENSITIVITY_TABLE_BY_BUG[bug];
        }

        var numTested = null;   // Default to unknown if based on general reference source
        if ( NUMBER_TESTED_KEY in sensTable )
        {
            numTested = sensTable[NUMBER_TESTED_KEY];
            if ( !totalNumTested ) { totalNumTested = 0; }
            totalNumTested += numTested;
        }

        tableHTML.push('<tr valign=middle>');
        tableHTML.push('<td align=center class="headerCol">'+bug+'</td>');
        tableHTML.push('<td align=center style="background-color: '+cellColorPerValue(numTested)+'">'+formatValue(numTested)+'</td>');

        tableHTML.push('***MAX BUG SENSITIVITY PLACEHOLDER***');  // Put a placeholder element that will be overwritten when aggregate row stats
        colPlaceholderIndex = (tableHTML.length - 1);

        for( var j=0; j < drugListField.options.length; j++ )
        {
            var drug = drugListField.options[j].value;
            var sensValue = sensTable[drug];

            tableHTML.push('<td align=center style="background-color: '+cellColorPerValue(sensValue)+'">'+formatValue(sensValue)+'</td>');

            if ( maxSensPerBug[bug] == null || sensValue > maxSensPerBug[bug] )
            {
                maxSensPerBug[bug] = sensValue;
            }
            if ( minSensPerDrug[drug] == null || sensValue < minSensPerDrug[drug] )
            {
                minSensPerDrug[drug] = sensValue;
            }
        }
        tableHTML.push('</tr>');

        // Overwrite placeholder element with aggregated row statistics
        tableHTML[colPlaceholderIndex] = '<th align=center style="background-color: '+cellColorPerValue(maxSensPerBug[bug])+'">'+formatValue(maxSensPerBug[bug])+'</th>';

        if ( minOfMaxForAllDrugs == null || maxSensPerBug[bug] < minOfMaxForAllDrugs )
        {
            minOfMaxForAllDrugs = maxSensPerBug[bug];
        }
    }
    tableHTML.push('</table>');

    // Fill in total number tested field
    tableHTML[numTestedPlaceholderIndex] = '<th style="background-color: '+cellColorPerValue(totalNumTested)+'">'+formatValue(totalNumTested)+'</th>';

    // Go back and fill in / overwrite placeholder element with aggregated column statistics
    var replacementHTML = new Array();
    replacementHTML.push('<th style="background-color: '+cellColorPerValue(minOfMaxForAllDrugs)+'">'+formatValue(minOfMaxForAllDrugs)+'</th>');
    for( var j=0; j < drugListField.options.length; j++ )
    {
        var drug = drugListField.options[j].text;
        replacementHTML.push('<th style="background-color: '+cellColorPerValue(minSensPerDrug[drug])+'">'+formatValue(minSensPerDrug[drug])+'</th>');
    }
    tableHTML[rowPlaceholderIndex] = replacementHTML.join("\n");

    return tableHTML.join("\n");
}

/**
 * Format header text for display.  Preferably sideways, but may have to improvise
 */
function formatHeader(inText)
{
    return inText.replace('/',' / ');
}

/**
 * Format cell value.  Usually just direct, but if null / undefined, then '?'
 */
function formatValue(inText)
{
    if ( !inText && inText != 0 )
    {
        return '?';
    }
    return inText;
}

/**
 * Based on the drug sensitivity represented by the cell, specify a background color to help highlight
 * Expects sensitivityValue to range from 0 to 100 representing a percentage
 */
function cellColorPerValue(sensValue)
{
    if ( !sensValue && sensValue != 0 || sensValue == '?') { return SENSITIVITY_COLOR_UNKNOWN.valueOf(); }

    sensValue = ( sensValue > 100 ? 100 : sensValue );
    sensValue = ( sensValue < 0 ? 0 : sensValue );

    var posColor = SENSITIVITY_COLOR_POSITIVE;
    var negColor = SENSITIVITY_COLOR_NEGATIVE;
    var scalar = null;

    // For brighter color in moderate range, use different delimiting color there
    //  and scale sensitivity value to 0.0-1.0 range
    if ( sensValue > 50 )
    {
        negColor = SENSITIVITY_COLOR_MODERATE;
        scalar = (sensValue-50)/50.0;
    }
    else
    {
        posColor = SENSITIVITY_COLOR_MODERATE;
        scalar = sensValue/50.0;
    }

    var cellColor = new Color();
    cellColor.setRed( negColor.getRed() + (posColor.getRed()-negColor.getRed()) * scalar );
    cellColor.setGreen( negColor.getGreen() + (posColor.getGreen()-negColor.getGreen()) * scalar );
    cellColor.setBlue( negColor.getBlue() + (posColor.getBlue()-negColor.getBlue()) * scalar );
    return cellColor.valueOf();
}


/**
 * Load the data input field with pre-constructed antibiogram data
 *  and auto-submit to update in-memory sensitivity data
 */
function loadSensitivityData( dataLoadField, antibiogramName, noAutoSubmit, keepPriorData )
{
    var clearPriorData = !keepPriorData;
    if ( !antibiogramName )
    {
        antibiogramName = "default";
    }
    dataLoadField.value = SENSITIVITY_DATA_PER_SOURCE[antibiogramName];

    if ( !noAutoSubmit )
    {
        submitSensitivityData(dataLoadField, clearPriorData);
    }
}

/**
 * Submit the sensitivity data in the input field to update or replace
 *  the current in-memory sensitivity data
 *
 * clearPriorData - If set, will first wipe out any prior sensitivity data.
 *      Default left unset, will just update prior data with new ones
 */
function submitSensitivityData(dataLoadField, clearPriorData)
{
    var theForm = dataLoadField.form;

    if ( clearPriorData )
    {
        for( var bug in SENSITIVITY_TABLE_BY_BUG )
        {
            delete SENSITIVITY_TABLE_BY_BUG[bug];
        }
    }
    // Parse through the data load field line by line
    var dataLines = dataLoadField.value.split('\n');
    for( var i=0; i < dataLines.length; i++ )
    {
        var dataLine = dataLines[i].trim();
        if ( dataLine )
        {
            var dataChunks = dataLine.split('\t');
            if ( dataChunks.length < 3 )
            {
                println('Expected 3 columns from line '+i+': '+ dataLine );
            }
            else
            {
                var sens = parseInt(dataChunks[0]);
                var bug = dataChunks[1];
                var drug = dataChunks[2];

                if ( isNaN(sens) )
                {
                    println('Expect value from 0-100, but got non-numeric sensitivity value in 1st column of line '+i+': '+ dataLine );
                }
                else if ( !(bug in PROPERTIES_BY_BUG) )
                {
                    println('Unrecognized bug name in 2nd column of line '+i+': '+ dataLine );
                }
                else if ( !(drug in PROPERTIES_BY_DRUG) )
                {
                    println('Unrecognized drug name in 3rd column of line '+i+': '+ dataLine );
                }
                else
                {   // Data looks valid.  Numerical sensitivity and recognized bug and drug names
                    if ( !(bug in SENSITIVITY_TABLE_BY_BUG) )
                    {
                        SENSITIVITY_TABLE_BY_BUG[bug] = {};
                    }
                    SENSITIVITY_TABLE_BY_BUG[bug][drug] = sens;
                }
            }
        }
    }
    println('Completed parsing '+i+' lines of data');

    // Update the list of available bugs and drugs to select from
    updateBugList(theForm);
    updateDrugList(theForm);
}


/**
 * Convenience function for printing out messages to the feedback element.
 *  Include indentation depth option
 */
function print( message, depth )
{
    var theForm = document.forms[0];
    var feedbackField = theForm.feedback;

    depth = parseInt(depth);
    if (depth)
    {
        for( var i=0; i < depth; i++ )
        {
            feedbackField.value += '   ';
        }
    }
    feedbackField.value += message;
}
function println( message, depth )
{
    if ( !message ) { message = ''; }
    print( message +'\n', depth );
}
function summaryPoint( message )
{
    var theForm = document.forms[0];
    theForm.summary.value += '= '+message+' ='+'\n';
}

function reset()
{
    var theForm = document.forms[0];
    theForm.feedback.value = '';
    theForm.summary.value = '';
}

