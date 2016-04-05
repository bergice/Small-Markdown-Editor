(function() {
  var Recents, closeapp, editor, editorScrolled, load, resultScrolled, setColors;

  Recents = (function() {
    function Recents() {
      localStorage.recent = ["C:\\Users\\bergice\\AppData\\Roaming\\npm\\node_modules\\bower\\lib\\node_modules\\mout\\doc\\random.md"];
    }

    Recents.prototype.get = function() {
      return localStorage.recent;
    };

    Recents.prototype.getLast = function() {
      return localStorage.recent;
    };

    Recents.prototype.push = function(str) {
      return localStorage.recent.push(str);
    };

    return Recents;

  })();

  editor = require("./../js/editor.js");

  global.window = window;

  global.$ = $;

  global.gui = require('nw.gui');

  closeapp = function() {
    return global.gui.App.quit();
  };

  $("#exit").click(function() {
    return closeapp();
  });

  $(window).keydown(function(event) {
    if (!(String.fromCharCode(event.which).toLowerCase() === 'w' && event.ctrlKey)) {
      return true;
    }
    event.preventDefault();
    closeapp();
    return false;
  });

  setColors = function() {
    var ColorScheme, colors, scheme;
    ColorScheme = require('color-scheme');
    scheme = new ColorScheme();
    scheme.from_hue(170).scheme('mono').variation('soft');
    colors = scheme.colors();
    $(".toolbar").css("background-color", "#" + colors[0]);
    $(".md_editor").css("background-color", "#" + colors[1]);
    $("body").css("color", "#" + colors[2]);
    $(".md_result").css("color", "#" + colors[0]);
    return $(".md_editor").css("color", "#" + colors[3]);
  };

  load = function(fname) {
    var fs;
    fs = require("fs");
    return fs.readFile(fname, function(err, data) {
      if (data != null) {
        $(".md_editor").html(data.toString());
      }
      $("#title").html(fname.substring(fname.lastIndexOf("\\") + 1));
      return editor.reload();
    });
  };

  editorScrolled = function() {
    return $(".md_result").scrollTop($(".md_editor").scrollTop());
  };

  resultScrolled = function() {
    return $(".md_editor").scrollTop($(".md_result").scrollTop());
  };

  $(function() {
    var recents;
    $('#editor').bind('input propertychange', function() {
      return editor.reload();
    });
    $(".md_editor").scroll(function() {
      return editorScrolled();
    });
    $(".md_result").scroll(function() {
      return resultScrolled();
    });
    setColors();
    $(".md_editor").focus();
    recents = new Recents();
    if (recents.getLast() != null) {
      return load(recents.getLast());
    }
  });

}).call(this);
