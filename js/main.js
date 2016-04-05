(function() {
  var Recents, closeapp, cut, editor, editorScrolled, fs, newdocument, open, opendocument, recents, resultScrolled, save, savedocument, setColors, updatetitle;

  Recents = (function() {
    function Recents() {}

    Recents.prototype.get = function() {
      return localStorage.recent;
    };

    Recents.prototype.getLast = function() {
      return localStorage.recent;
    };

    Recents.prototype.push = function(str) {
      return localStorage.recent = str;
    };

    return Recents;

  })();

  cut = function(str) {
    return str.replace(/^.*[\\\/]/, '');
  };

  editor = require("./../js/editor.js");

  global.window = window;

  global.$ = $;

  global.gui = require('nw.gui');

  fs = require("fs");

  recents = new Recents();

  closeapp = function() {
    return global.gui.App.quit();
  };

  savedocument = function(saveas) {
    var chooseFile;
    if (saveas == null) {
      saveas = false;
    }
    if (!saveas && localStorage.currentDocument) {
      save($(".md_editor").val(), localStorage.currentDocument);
      return;
    }
    chooseFile = function(name) {
      var chooser;
      chooser = $(name);
      chooser.unbind('change');
      chooser.change(function(evt) {
        return save($(".md_editor").val(), $(this).val());
      });
      return chooser.trigger('click');
    };
    return chooseFile('#fileSaveDialog');
  };

  save = function(content, fpath) {
    return fs.writeFile(fpath, content, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file '" + fpath + "' was saved!");
      console.log("Content: '" + content + "'");
      return updatetitle(false);
    });
  };

  opendocument = function() {
    var chooseFile;
    chooseFile = function(name) {
      var chooser;
      chooser = $(name);
      chooser.unbind('change');
      chooser.change(function(evt) {
        return open($(this).val());
      });
      return chooser.trigger('click');
    };
    return chooseFile('#fileOpenDialog');
  };

  open = function(fpath) {
    return fs.readFile(fpath, function(err, data) {
      var fname;
      if (data != null) {
        $(".md_editor").html(data.toString());
      }
      fname = cut(fpath);
      $("#title").html(fname);
      editor.reload();
      localStorage.currentDocument = fpath;
      return recents.push(localStorage.currentDocument);
    });
  };

  newdocument = function() {
    localStorage.currentDocument = null;
    $(".md_editor").html("");
    $("#title").html("untitled.md");
    return editor.reload();
  };

  $(window).keydown(function(event) {
    if (event.ctrlKey) {
      switch (String.fromCharCode(event.which).toLowerCase()) {
        case 'w':
          event.preventDefault();
          closeapp();
          return false;
        case 's':
          event.preventDefault();
          savedocument(event.altKey);
          return false;
        case 'o':
          event.preventDefault();
          opendocument();
          return false;
        case 'n':
          event.preventDefault();
          newdocument();
          return false;
      }
    }
    return true;
  });

  setColors = function() {
    var ColorScheme, colors, scheme;
    ColorScheme = require('color-scheme');
    scheme = new ColorScheme();
    scheme.from_hue(270).scheme('mono').variation('soft');
    colors = scheme.colors();
    $(".toolbar").css("background-color", "#" + colors[0]);
    $(".md_editor").css("background-color", "#" + colors[1]);
    $("body").css("color", "#" + colors[2]);
    $(".md_result").css("color", "#" + colors[0]);
    return $(".md_editor").css("color", "#" + colors[2]);
  };

  editorScrolled = function() {
    return $(".md_result").scrollTop($(".md_editor").scrollTop());
  };

  resultScrolled = function() {
    return $(".md_editor").scrollTop($(".md_result").scrollTop());
  };

  updatetitle = function(changed) {
    var str;
    if (changed == null) {
      changed = false;
    }
    str = "untitled.md";
    if (localStorage.currentDocument != null) {
      str = cut(localStorage.currentDocument);
    }
    if (changed) {
      str += "*";
    }
    return $("#title").html(str);
  };

  $(function() {
    $('#editor').bind('input propertychange', function() {
      editor.reload();
      return updatetitle(true);
    });
    $(".md_editor").scroll(function() {
      return editorScrolled();
    });
    $(".md_result").scroll(function() {
      return resultScrolled();
    });
    setColors();
    if ((recents.getLast() != null)) {
      open(recents.getLast());
    } else {
      newdocument();
    }
    $(".md_editor").focus();
    $("#notebook").click(function() {
      return alert("CLICKED");
    });
    $("#exit").click(function() {
      return closeapp();
    });
    $("body").prepend("<input style=\"display:none;\" id=\"fileOpenDialog\" type=\"file\"/>");
    return $("body").prepend("<input style=\"display:none;\" id=\"fileSaveDialog\" type=\"file\" nwsaveas=\"untitled.md\"/>");
  });

}).call(this);
