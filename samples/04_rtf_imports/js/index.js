function get_root_element() {
    return $(document.body)
}
function setPictBorder(elem, show) {
    return elem.css("border", show ? "1px dotted red" : "none");
}
function setUnsafeLink(elem, warn) {
    return elem.css("border", warn ? "1px dashed red" : "none");
}
function displayRtfFile(blob, configs={}) {
    try {
        var opts = Object.assign({}, {legacyPictures: true, showPicBorder: false, warnHttpLinks: false, baseURL: ""}, configs)

        var legacyPictures = opts.legacyPictures == true;
        var showPicBorder  = opts.showPicBorder  == true;
        var warnHttpLinks  = opts.warnHttpLinks  == true;
        var settings = {
            onPicture: function(isLegacy, create) {
                // isLegacy is null if it's the only available picture (e.g. legacy rtf)
                let allow_append = !isLegacy || legacyPictures;
                let elem;
                if (allow_append) {
                    elem = $(create());
                    elem.attr("class", "rtfpict");
                    setPictBorder(elem, showPicBorder);
                    elem = elem[0];
                }
                return elem;
            },
            onHyperlink: function(create, hyperlink) {
                var url = hyperlink.url();
                var lnk = create();
                if (url.substr(0, 7) == "http://") {
                    // Wrap http:// links into a <span>
                    var span = setUnsafeLink($("<span>").addClass("unsafelink").append(lnk), warnHttpLinks);
                    span.click(function(evt) {
                        if (warnHttpLinks) {
                            evt.preventDefault();
                            alert("Unsafe link: " + url);
                            return false;
                        }
                    });
                    return {
                        content: lnk,
                        element: span[0]
                    };
                } else {
                    return {
                        content: lnk,
                        element: lnk
                    };
                }
            },
            onImport: function(relURL, cb) {
                const file = opts.baseURL + relURL;
                const ext  = relURL.replace(/^.*\.([^\.]+)$/, '$1').toLowerCase();
                let keyword;
                switch(ext) {
                    case 'emf':
                        keyword = 'emfblip';
                        break;
                    case 'wmf':
                        keyword = 'wmetafile';
                        break;
                    default:
                        return cb();
                }
                $.ajax({
                    url: file,
                    dataType: "binary",
                    processData: false,
                    success: function(result) {
                        var reader = new FileReader();
                        reader.onload = function(evt) {
                            let blob   = evt.target.result;
                            let height = 300 + (Number(relURL.replace(/[^0-9]/g, '')) * 100);
                            cb({keyword, blob, height});
                        };
                        reader.readAsArrayBuffer(result);
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        let error = errorThrown ? new Error(errorThrown) : new Error(textStatus);
                        cb({error});
                    }
                });
            }
        };
        var doc = new RTFJS.Document(blob, settings);

        doc.render().then(html => {
            get_root_element().empty().append(html);
        }).catch(e => {
            if (e instanceof RTFJS.Error) {
                $("#content").text("Error: " + e.message);
                throw e;
            }
            else {
                throw e;
            }
        });
    } catch(e) {
        if (e instanceof RTFJS.Error)
            get_root_element().text("Error: " + e.message);
        else
            throw e;
    }
}
function stringToBinaryArray(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i=0; i<string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}
function loadRtfFile(file) {
    $.ajax({
        url: file,
        dataType: "text",
        processData: false,
        success: function(result) {
            displayRtfFile(stringToBinaryArray(result), {baseURL: file.replace(/^(.*\/)[^\/]*$/, '$1')});
        },
        error: function(jqXHR, textStatus, errorThrown) {
            get_root_element().text("Error: " + errorThrown);
        }
    });
}
