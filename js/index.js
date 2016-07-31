var _cssObj = {},
    conf = {
        picNum: 0,
        picPath: []
    };
var $ = function(cls, first) {
        var scope = this instanceof HTMLElement ? this : document;
        if (/^\#[\w-]+$/.test(cls)) {
            return scope.getElementById(cls.replace(/^\#/, ""));
        } else if (/^\.[\w-]+$/.test(cls)) {
            var res = scope.getElementsByClassName(cls.replace(/^\./, ""));
            if (first) {
                return res[0];
            }
            return res;
        } else if (/^[a-zA-Z]+$/g.test(cls)) {
            var res = scope.getElementsByTagName(cls);
            if (first) {
                return res[0];
            }
            return res;
        } else {
            var res = document.querySelectorAll(cls);
            if (first) {
                return res[0];
            }
            return res;
        }
    },
    forEach = Array.prototype.forEach,
    concat = Array.prototype.concat,
    efn = function() {},
    currImg,
    selectText = function(node) {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(node);
            window.getSelection().addRange(range);
        }
    };

function loadImage(index, cb) {
    if (index > conf.picPath.length - 1) {
        cb || efn("not so much", null);
        return;
    }
    var img = new Image();
    img.onload = function() {
        var ui = $("#ui"),
            ctx = ui.getContext("2d");
        ui.setAttribute("width", img.width);
        ui.setAttribute("height", img.height);
        ui.setAttribute("data-index", index);
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, img.width, img.height)
        ctx.drawImage(img, 0, 0);
        currImg = img;
        cb || efn(null, img);
    }
    img.src = conf.picPath[index];
} + function() {
    forEach.bind($(".colors"))(function(el) {
        el.addEventListener('contextmenu', contextmenuOn);
    })
    document.body.addEventListener("click", contextmenuOff);
    document.body.addEventListener("contextmenu", contextmenuOff);
    document.body.addEventListener("keyup", bigPicOff)
    forEach.bind($("#infoContainer>div"))(function(el) {
        el.addEventListener("click", function() {
            var active = $("#infoContainer>.active", true);
            if (active) {
                active.classList.remove("active")
            }
            this.classList.add("active");
        })
    })
    $(".changePic", true).addEventListener("click", function() {
        var index = +($("#ui").getAttribute("data-index") || -1) + 1;
        console.log(index)
        loadImage(index)
    })
    var marking = false;
    $("#ui").addEventListener("mousedown", function(e) {
        marking = {
            x: e.offsetX,
            y: e.offsetY
        };
    });
    $("#ui").addEventListener("mousemove", function(e) {
        if (e.ctrlKey && !marking) {
            var big = $(".bigPic", true) || (function() {
                var c = document.createElement("canvas");
                c.width = 150, c.height = 150;
                c.classList.add("bigPic");
                document.body.appendChild(c);
                return c;
            })();
            big.classList.remove("hide"),
                big.style.top = e.clientY + 10 + "px",
                big.style.left = e.clientX + "px";
            var bigCtx = big.getContext('2d');
            bigCtx.drawImage(currImg, e.offsetX - 35, e.offsetY - 35, 70, 70, 0, 0, 150, 150);
            bigCtx.beginPath();
            bigCtx.strokeStyle = "#FD5E5E";
            bigCtx.rect(74, 74, 2, 2);
            bigCtx.stroke();
        }
        if (!marking) {
            var ctx = this.getContext("2d"),
                picker = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data,
                hex = "#",
                cc = $(".currentColor", true);
            picker.slice(0, 3).forEach(function(v) {
                var t = ("0" + v.toString(16));
                hex += t.substring(t.length - 2);
            })
            hex = hex.toUpperCase();
            cc.innerText = "当前颜色:" + hex;
            cc.style["background-color"] = hex;
        }
    });
    $("#ui").addEventListener("mouseup", function(e) {
        var ctx = this.getContext("2d"),
            i = document.createElement("i"),
            act = $("#infoContainer>.active>.colors", true),
            actc = $("#infoContainer>.active", true),
            picker = ctx.getImageData(marking.x, marking.y, 1, 1).data,
            color = "rgba(" + picker[0] + "," + picker[1] + "," + picker[2] + "," + picker[3] + ")",
            type = actc.classList.contains("backs") ? "background-color" : actc.classList.contains("fonts") ? "color" : "border",
            hex = "#";
        picker.slice(0, 3).forEach(function(v) {
            var t = ("0" + v.toString(16));
            hex += t.substring(t.length - 2);
        })
        hex = hex.toUpperCase();
        i.style["background-color"] = hex;
        act.appendChild(i);
        _cssObj[type] = _cssObj[type] || [];
        _cssObj[type].push(hex);
        ctx.beginPath();
        ctx.strokeStyle = "#FD5E5E";
        ctx.moveTo(marking.x, marking.y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.font = "15px 'mirosoft yahei'";
        ctx.strokeStyle = "#22C8BA";
        ctx.strokeText(hex, e.offsetX, e.offsetY);
        marking = false;
    });

    function contextmenuOff(e) {
        var menu = $("menu", true);
        if (menu) {
            menu.classList.add("hide")
        }
        //if(menu){document.body.removeChild(menu);}
    }

    function contextmenuOn(e) {
        if (e.target.tagName.toUpperCase() == "I") {
            if (e.ctrlKey) {
                return true;
            }
            var menu = $("menu", true) || (function() {
                var m = document.createElement("menu");
                m.innerHTML = '<ul><li class="del">删除</li><li class="mod">修改</li></ul>';
                document.body.appendChild(m);
                return m;
            })();
            menu.classList.remove("hide");
            menu.style.top = e.clientY + 10 + "px",
                menu.style.left = e.clientX + "px";
            e.cancelBubble = true;
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    function bigPicOff() {
        var bigPic = $(".bigPic", true);
        if (bigPic) {
            bigPic.classList.add("hide")
        }
    }
}()

function saveCss1() {
    var css = "",
        img = $("#ui").toDataURL(),
        pop;
    for (var cssName in _cssObj) {
        var cls = "color" == cssName ? "fc" : "border" == cssName ? "bo" : "bg";
        _cssObj[cssName].forEach(function(v) {
            css += "." + cls + "-" + v.replace("#", "") + "{\n\t" + cssName + ":" + (cssName == "border" ? "1px solid " + v : v) + ";\n}\n"
        });
    }
    if (pop = $(".pop-alert", true)) {
        pop.getElementsByTagName("pre")[0].innerHTML = css;
        pop.classList.remove("hide");
    } else {
        pop = document.createElement("div");
        pop.classList.add("pop", "pop-alert");
        pop.innerHTML = "<i class='close'>×</i>" + "<pre class='code css'>" + css + "</pre>";
        document.body.appendChild(pop)
        pop.getElementsByTagName("i")[0].addEventListener("click", function() {
            pop.classList.add("hide")
        })
        pop.getElementsByTagName("pre")[0].addEventListener("dblclick", function(e) {
            selectText(this)
            e.preventDefault();
            e.stopPropagation();
        })
    }
}
document.addEventListener("mouseup", function(e) {
    e.preventDefault();
})

function addPic() {
    var pop;
    if (pop = $(".pop-drag", true)) {
        pop.classList.remove("hide");
    } else {
        pop = document.createElement("div");
        pop.classList.add("pop", "pop-drag");
        pop.innerHTML = "<i class='close'>×</i>" + "<div class='drag'>拖拽图片进来或者双击这里</div>" + "<ul class='imgList'></ul>";
        document.body.appendChild(pop)
        pop.getElementsByTagName("i")[0].addEventListener("click", function() {
            pop.classList.add("hide")
        })
        pop.getElementsByClassName("drag")[0].addEventListener("dblclick", function(e) {
            $("#_up_").addEventListener("change", function() {
                _listImg(this.files);
            });
            $("#_up_").click();
            e.preventDefault();
            e.stopPropagation();
        })
        pop.addEventListener("dragover", function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        })
        pop.addEventListener("drop", function(e) {
            _listImg(e.dataTransfer.files)
            e.preventDefault();
            e.stopPropagation();
            return false;
        })

        function _listImg(files) {
            var list = pop.getElementsByTagName("ul")[0];
            forEach.bind(files)(function(file) {
                var reader = new FileReader(),
                    img = document.createElement("img"),
                    li = document.createElement("li");
                reader.onload = function() {
                    img.src = reader.result;
                    conf.picPath.push(reader.result);
                    $("#picNum").innerText = conf.picPath.length;
                    !$("#ui").getAttribute("data-index") && loadImage(0);
                }
                reader.readAsDataURL(file);
                li.appendChild(img);
                list.appendChild(li);
            })
        }
    }
}

function savePic() {
    var url = $("#ui").toDataURL("image/png");
    window.open(url);
}