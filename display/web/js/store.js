String.prototype.format = function () {
    var values = arguments;
    return this.replace(/\{(\d+)\}/g, function (match, index) {
        if (values.length > index) {
            return values[index];
        } else {
            return "";
        }
    });
};

var tbrow = '<tr><td>{0}</td><td>{1}</td><td>{2}</td><td><i title="删除" class="hand fa fa-times fa-1x" aria-hidden="true" onclick="removeDevice(\'{0}\')"></i>&nbsp;&nbsp<i id="{0}" title="运行/停止" class="hand fa" aria-hidden="true" onclick="handleDevice(\'{0}\')"></i>&nbsp;&nbsp<i title="修改配置" class="hand fa fa-pencil-square-o" aria-hidden="true" onclick="edit(\'{0}\')"></i></td></tr>'

$(document).ready(function () {
    var data = {
        "type": "store"
    };
    $.ajax({
        url: '../api/extension/all',
        type: 'POST',
        data: data
    }).done(function (res) {
        $.each(JSON.parse(res), function (index, item) {
            var newRow = tbrow.format(item.ID, item.Name, item.FileName);
            $("#tb_devices tr:last").after(newRow);
            if (item.Status == 0) {
                $("#" + item.ID).addClass("fa-play");
            } else {
                $("#" + item.ID).addClass("fa-pause");
            }
            //鼠标移动到行变色,单独建立css类hover 
            //tr:gt(0):表示获取大于 tr index 为0 的所有tr，即不包括表头 
            $("#tb_devices tr:gt(0)").hover(function () {
                $(this).addClass("hover")
            }, function () {
                $(this).removeClass("hover")
            });
            $("#tb_devices i").hover(function () {
                $(this).addClass("back")
            }, function () {
                $(this).removeClass("back")
            });

        });
    }).fail(function (res) {

    });
    // loadLog();
    // setInterval("loadLog()",10000);
});
function removeDevice(obj) {
    var data = {
        id: obj
    };
    $.ajax({
        type: "POST",
        url: "/api/extension/remove",
        traditional: true,
        // contentType: "application/json",
        // data: JSON.stringify(data),
        data: data,
        success: function (msg) {
            alert(msg);
            window.location.href = 'store.html';
        }
    });
}
function handleDevice(obj) {
    $("#btn_handle").attr("disabled", "disabled");
    var data = {
        id: obj
    };
    if ($("#" + obj).hasClass("fa-play")) {
        $.ajax({
            type: "POST",
            url: "/api/extension/run",
            traditional: true,
            data: data,
            success: function (msg) {
                if (msg == "running") {
                    $("#" + obj).removeClass("fa-play");
                    $("#" + obj).addClass("fa-pause");
                } else {
                    alert(msg);
                }
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "/api/extension/stop",
            traditional: true,
            // contentType: "application/json",
            // data: JSON.stringify(data),
            data: data,
            success: function (msg) {
                if (msg == "stopped") {
                    $("#" + obj).removeClass("fa-pause");
                    $("#" + obj).addClass("fa-play");
                }
            }
        });
    }
    $("#removeButton").removeAttr("disabled");
}

function edit(obj) {
    window.location.href = 'editextension.html?id=' + obj;
}

