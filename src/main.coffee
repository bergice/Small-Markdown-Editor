#   cfcoptions : { "out": "../js/"   }



# Recents
class Recents

    constructor: ->
        localStorage.recent = ["C:\\Users\\bergice\\AppData\\Roaming\\npm\\node_modules\\bower\\lib\\node_modules\\mout\\doc\\random.md"]

    get: ->
        localStorage.recent

    getLast: ->
        localStorage.recent

    push: (str) ->
        localStorage.recent.push str



# Prepare global and call init
editor = require("./../js/editor.js")
global.window = window
global.$ = $
global.gui = require('nw.gui')



# Close App Function
closeapp = ->
    global.gui.App.quit()



$("#exit").click ->
    closeapp()



# Hotkey for closing the app. (CTRL+W)
$(window).keydown((event) ->

    return true unless String.fromCharCode(event.which).toLowerCase() is 'w' and event.ctrlKey

    event.preventDefault()
    closeapp()
    return false
)



# Sets css colors from color scheme
setColors = ->
    ColorScheme = require('color-scheme')

    scheme = new ColorScheme()
    scheme.from_hue(170) # Start the scheme
        .scheme('mono') # Use the 'triade' scheme, that is, colors
        # selected from 3 points equidistant around  the color wheel.
        .variation('soft') # Use the 'soft' color variation

    colors = scheme.colors()

    $(".toolbar").css("background-color", "#" + colors[0])
    $(".md_editor").css("background-color", "#" + colors[1])
    #$(".md_result").css("background-color", "#" + colors[2])
    $("body").css("color", "#" + colors[2])
    $(".md_result").css("color", "#" + colors[0])
    $(".md_editor").css("color", "#" + colors[3])



# Load a file
load = (fname) ->
    fs = require("fs")
    fs.readFile(fname, (err, data) ->
        $(".md_editor").html(data.toString()) if data?
        $("#title").html(fname.substring(fname.lastIndexOf("\\")+1))
        editor.reload()
    )



# Scroll responses
editorScrolled = ->
    $(".md_result").scrollTop( $(".md_editor").scrollTop() )
resultScrolled = ->
    $(".md_editor").scrollTop( $(".md_result").scrollTop() )



# Called on $(document).ready
$ ->
    $('#editor').bind('input propertychange', ->
        editor.reload()
    )

    $(".md_editor").scroll ->
        editorScrolled()

    $(".md_result").scroll ->
        resultScrolled()

    setColors()

    $(".md_editor").focus()

    recents = new Recents();

    load(recents.getLast()) if recents.getLast()?
