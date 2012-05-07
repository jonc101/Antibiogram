/**
 * Sentinel constant value to take place of empty strings
 */
var NULL_TAG = '<NULL>';

/**
 * String trimming functions (eliminates leading and trailing white-space)
 */
function strltrim() {
    return this.replace(/^\s+/,'');
}

function strrtrim() {
    return this.replace(/\s+$/,'');
}
function strtrim() {
    return this.replace(/^\s+/,'').replace(/\s+$/,'');
}

String.prototype.ltrim = strltrim;
String.prototype.rtrim = strrtrim;
String.prototype.trim = strtrim;

/**
 * Moves all of the selected items from the sourceList to the target List
 */
function selectMove( sourceList, targetList )
{
    // Iterate through backwards otherwise might miss some as delete and shift positions
    for( var i=sourceList.options.length-1; i > -1; i-- )
    {
        var nextOp = sourceList.options[i];
        if ( nextOp.selected )
        {
            targetList.options.add( new Option( nextOp.text, nextOp.value ) );
            sourceList.options.remove(i);
        }
    }
}

/**
 * Sets the selected attribute of all options in the itemList to the
 * specified value (true/false).  This is handy if you want to select
 * all items in a list such that they will all be submitted with an HttpRequest
 */
function selectAllList( itemList, selectValue )
{
   for( var i=0; i < itemList.options.length; i++ )
   {
      itemList.options[i].selected = selectValue;
   }
}


/**
 * <p>Iterates through the field array and sets the value
 * to that specified for each.  If field is not an array,
 * but a single object, then just set that one.
 *
 * <p> Attribute is the field attribute to set.  Normally is just the field "value,"
 * but could specify something else like the fields "checked" or selected attribute.
 */
function setAll( field, value, attribute )
{
    setAllWhere( field, value, null, attribute );
}

/**
 * Like setAll, but only set the fields where the current
 * value is equal to the specified condition value.
 *
 * <p> Attribute is the field attribute to set.  Normally is just the field "value,"
 * but could specify something else like the fields "checked" or selected attribute.
 */
function setAllWhere( field, value, condition, attribute )
{
    if ( attribute == null ) { attribute = 'value'; }

    if ( field.length )
    {   // Is an array
        for( var i=0; i < field.length; i++ )
        {
            if ( condition == null || field[i].value == condition )
            {
                eval('field[i].'+ attribute +' = value');
            }
        }
    }
    else
    {
        if ( condition == null || field.value == condition )
        {
            eval('field.'+ attribute +' = value');
        }
    }
}

/**
 * Popup window with standard configuration.
 */
function stdPopup( url, queryString, width, height )
{   // Default values
    if (!width ) { width = 600; }
    if (!height) { height= 600; }

    var popup =
        window.open
        (   url+'?'+queryString,
            url.replace(/[^a-zA-Z]/,'_'),
            'width='+width+',height='+height+',resizable=yes,status=yes,toolbar=yes,scrollbars=yes'
        );
    //popup.caller = window.self;
    popup.focus();
}

/**
 * Close the current window (popup) and refresh the calling window
 * that opened this popup.
 * Requires that the calling window, when creating this popup,
 * added a reference in the popup to the caller like (popup.caller = self).
 *
 */
/* Forget it, this is unreliable.  If popup window's page changed (after a
 * form submit) the caller reference is gone too.
function returnToCaller(popup,noReload)
{
    if ( !noReload )
    {
        popup.caller.document.location.reload();
    }
    popup.caller.focus();
    popup.close();
}
 */

/**
 * Given a form, determines if any fields have changed
 * from the default values the page started with
 */
function changesMade( theForm )
{
    for( var i=0; i < theForm.elements.length; i++ )
    {
        var field = theForm.elements[i];
        if ( field.type == "select-one" || field.type == "select-multiple" )
        {   // Select lists require special attention to check default values
            for( var j=0; j < field.options.length; j++ )
            {
                if ( field.options[j].defaultSelected != field.options[j].selected )
                {
                    //alert(field.name+':'+field.options[j].value);
                    return true;
                }
            }
        }
        else
        {   // Most fields just have to do simple default value check
            if ( field.defaultValue != field.value )
            {
                //alert(field.name+':'+field.defaultValue);
                return true;
            }
        }
    }
    return false;
}

/**
 * Check if any of the form fields have changed.
 * If so, then alert the user with a message box
 * to confirm that they don't want to save those changes.
 */
function confirmNoSave( theForm, message )
{
    if ( changesMade(theForm) )
    {
        return window.confirm(message);
    }
    return true;
}

/**
 * Change the target window of the form to the new target.
 * Only do this temporarily however.  After a short duration (1 second),
 * revert the form back to its original target.
 */
function retargetForm(theForm,newTarget)
{
    var origTarget = theForm.target;
    theForm.target = newTarget;
    var command = "document."+theForm.name+".target = '"+origTarget+"';"
    //alert(command);
    window.setTimeout(command,1000);
}