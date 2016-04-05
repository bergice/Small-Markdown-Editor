#   cfcoptions : { "out": "../js/"   }



# Recents
class Recents

    get: ->
        localStorage.recent

    getLast: ->
        localStorage.recent

    push: (str) ->
        localStorage.recent = str



# Returns substring after last \
cut = (str) ->
    return str.replace(/^.*[\\\/]/, '')
    #return str.substring(str.lastIndexOf("\\")+1)



# Prepare global and call init
editor = require("./../js/editor.js")
global.window = window
global.$ = $
global.gui = require('nw.gui')
fs = require("fs")
recents = new Recents();



# Close App Function
closeapp = ->
    global.gui.App.quit()



# Save Document Function
savedocument = (saveas=false) ->

    if not saveas and localStorage.currentDocument
        save($(".md_editor").val(), localStorage.currentDocument)
        return

    chooseFile = (name) ->
        chooser = $(name)
        chooser.unbind('change')
        chooser.change((evt) ->
            save($(".md_editor").val(), $(this).val())
        )
        chooser.trigger('click')

    chooseFile('#fileSaveDialog')

save = (content, fpath) ->

    fs.writeFile(fpath, content, (err) ->
        if (err) then return console.log(err)
        console.log("The file '#{fpath}' was saved!")
        console.log("Content: '#{content}'")
        updatetitle(false)
    )



# Open Document Function
opendocument = ->

    chooseFile = (name) ->
        chooser = $(name)
        chooser.unbind('change')
        chooser.change((evt) ->
            #if localStorage.currentDocument?
            #    r = confirm("Close the current document without saving?")
            #    return if not r

            open($(this).val())
        )
        chooser.trigger('click')

    chooseFile('#fileOpenDialog')

open = (fpath) ->
    fs.readFile(fpath, (err, data) ->
        $(".md_editor").html(data.toString()) if data?
        fname = cut(fpath)
        $("#title").html(fname)
        editor.reload()
        localStorage.currentDocument = fpath
        recents.push(localStorage.currentDocument)
    )




# New Document Function
newdocument = ->

    localStorage.currentDocument = null
    $(".md_editor").html("")
    $("#title").html("untitled.md")
    editor.reload()



# Hotkey for closing the app. (CTRL+W)
$(window).keydown((event) ->

    if event.ctrlKey
        switch String.fromCharCode(event.which).toLowerCase()
            when 'w'
                event.preventDefault()
                closeapp()
                return false
            when 's'
                event.preventDefault()
                savedocument(event.altKey)
                return false
            when 'o'
                event.preventDefault()
                opendocument()
                return false
            when 'n'
                event.preventDefault()
                newdocument()
                return false

    return true
)



# Sets css colors from color scheme
setColors = ->
    ColorScheme = require('color-scheme')

    scheme = new ColorScheme()
    scheme.from_hue(270) # Start the scheme
        .scheme('mono') # Use the 'triade' scheme, that is, colors
        # selected from 3 points equidistant around  the color wheel.
        .variation('soft') # Use the 'soft' color variation

    colors = scheme.colors()

    $(".toolbar").css("background-color", "#" + colors[0])
    $(".md_editor").css("background-color", "#" + colors[1])
    #$(".md_result").css("background-color", "#" + colors[2])
    $("body").css("color", "#" + colors[2])
    $(".md_result").css("color", "#" + colors[0])
    $(".md_editor").css("color", "#" + colors[2])



# Scroll responses
editorScrolled = ->
    $(".md_result").scrollTop( $(".md_editor").scrollTop() )
resultScrolled = ->
    $(".md_editor").scrollTop( $(".md_result").scrollTop() )



updatetitle = (changed=false) ->
    str = "untitled.md"
    str = cut(localStorage.currentDocument) if localStorage.currentDocument?
    str += "*" if changed
    $("#title").html(str)


# Called on $(document).ready
$ ->
    $('#editor').bind('input propertychange', ->
        editor.reload()
        updatetitle(true)
    )

    $(".md_editor").scroll ->
        editorScrolled()

    $(".md_result").scroll ->
        resultScrolled()

    setColors()

    if (recents.getLast()?) then open(recents.getLast()) else newdocument()


    #appe = (str) ->
    #    return "<li>" + str + "</li>"

    #r = appe num for num in recents.get()
    #processed = (cut num for num in r)
    #$("#recents").html(processed)
    #$("#recents").html(recents.get())



    #$(".md_editor").linedtextarea()
    $(".md_editor").focus()




    $("#notebook").click ->
        alert("CLICKED")


    $("#exit").click ->
        closeapp()




    $("body").prepend("<input style=\"display:none;\" id=\"fileOpenDialog\" type=\"file\"/>")
    $("body").prepend("<input style=\"display:none;\" id=\"fileSaveDialog\" type=\"file\" nwsaveas=\"untitled.md\"/>")
