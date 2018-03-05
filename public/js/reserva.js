$(document).ready(() => {
    let clickable = true;
    let allData, allKeys;

    fetch('/getMaterialList', {
        credentials: 'include'
      })
        .then(response => response.json())
        .then(res => {
            $(".loader").addClass("hideComponent")
            allData = res.dados;
            allKeys = res.keys;
            allData.map((item, index) => {
                $(".listTableContainer table .materialListContainer").append(`
                    <tr id="${allKeys[index]}" class="item">
                        <th class="text-center"><span class="listBtn listEdit fa fa-edit"></span></th>
                        <th> <span>${item.name}</span> </th>
                        <th> <span>${item.qtd}</span> </th>
                        <th> <span>${item.fornecedor}</span> </th>
                        <th> <span>${item.responsavel}</span></th>
                        <th> <span>${item.local}</span> </th> 
                        <th class="text-center"> <span class="listBtn listDelete fa fa-times-circle"></span></th>
                    </tr>  
                `);
            })
        });

    //Adicionar novo item
    $(".addItemBtnContainer").click(() => {
        if (clickable) {
            $(".listTableContainer table .materialListContainer").append(`
            <tr class="newItem">
            <th class="text-center"><span class="listBtn listSave fa fa-save"></span></th>
            <th> <span><input class="name" type="text"></span> </th>
            <th> <span><input class="qtd" type="text"></span> </th>
            <th> <span><input class="fornecedor" type="text"></span> </th>
            <th><span><input class="responsavel" type="text"></span></th>
            <th> <span><input class="local" type="text"></span> </th> 
            <th class="text-center"> <span class="listBtn newItemDelete fa fa-times-circle"></span></th>
          </tr>  
            `);
            $(".contentContainer").animate({
                scrollTop: $($(".newItem")).offset().top
            }, 500);
        }
        clickable = false;
    });


    $("body").on('click', '.newItemDelete', function () {
        clickable = true;
        $(this).parent().parent().remove();
    });

    $("body").on('click', '.editItemCancel', function () {
        let id = $(this).parent().parent().attr("id");
        $("#" + id + " th").each(function (index) {
            if (index == 0) {
                $(this).children().removeClass("editCurrentItem fa-save").addClass("listEdit fa-edit");
            }
            if (index != 0 && index != 6) {
                let currentInputValue = $(this).children().children().val();
                $(this).children().html(currentInputValue);
            }
            if (index == 6) {
                $(this).children().removeClass("editItemCancel").addClass("listDelete");
            }

        })
    });


    $("body").on('click', '.listSave', function () {
        if (checkInputs()) {
            let newItemInfo = {
                name: $(".name").val(),
                qtd: $(".qtd").val(),
                fornecedor: $(".fornecedor").val(),
                responsavel: $(".responsavel").val(),
                local: $(".local").val(),
            }
            fetch('/newListItem', {
                method: 'post',
                body: JSON.stringify(newItemInfo),
                headers: {
                    'content-type': 'application/json'
                },
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                allData.push(data.newData);
                allKeys.push(data.key)
                newItemSuccess(data.key);
                clickable = true;
            });
        }
    });

    // EDITAR ITEM

    $("body").on('click', '.listEdit', function () {
        let id = $(this).parent().parent().attr("id");
        spansToInputs(id);
    });

    $("body").on("click", ".editCurrentItem", function () {
        let clickedId = $(this).parent().parent().attr("id");
        if (checkEditInputs(clickedId)) {
            let editItemInfo = {
                id: clickedId,
                dados: {
                    name: $(".name").val(),
                    qtd: $(".qtd").val(),
                    fornecedor: $(".fornecedor").val(),
                    responsavel: $(".responsavel").val(),
                    local: $(".local").val()
                }
            }
            fetch('/editListItem', {
                method: 'post',
                body: JSON.stringify(editItemInfo),
                headers: {
                    'content-type': 'application/json'
                },
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                let key = allKeys.indexOf(data.key)
                allData[key] = data.newData
                editItemSuccess(clickedId);
            });
        }
    });

    let deleteID;
    $("body").on("click", ".listDelete", function () {
        deleteID = $(this).parent().parent().attr("id");
        $(".hide").removeClass("hide");
    });

    $("body").on("click", ".confirm", function () {
        deleteListItem(deleteID);
        hideDialog();
    });

    $("body").on("click", ".cancel", function () {
        hideDialog();
    });

    $(".blackScreen").click(() => {
        hideDialog();
    });
});

function hideDialog() {
    $(".blackScreen, .deleteMsgContainer").addClass("hide");
}

function deleteListItem(id) {
    fetch('/removeListItem', {
        method: 'delete',
        body: JSON.stringify({
            "id": id
        }),
        headers: {
            'content-type': 'application/json'
        },
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        $("#" + id).remove();
        showMsg();
    });

}

function checkInputs() {
    let noEmptyInputs = true;
    $(".newItem input").each(function () {
        if ($(this).val() == "") {
            noEmptyInputs = false;
            $(this).addClass("emptyInput");
        } else {
            $(this).removeClass("emptyInput");
        }
    });
    return noEmptyInputs;
}


function checkEditInputs(id) {
    let noEmptyInputs = true;
    $("#" + id + " input").each(function () {
        if ($(this).val() == "") {
            noEmptyInputs = false;
            $(this).addClass("emptyInput");
        } else {
            $(this).removeClass("emptyInput");
        }
    });
    return noEmptyInputs;
}

function newItemSuccess(id) {
    showMsg();
    $(".newItem").attr("id", id);
    $(".newItem th").each(function (index) {
        if (index == 0) {
            $(this).children().removeClass("listSave fa-save").addClass("listEdit fa-edit");
        }
        if (index != 0 && index != 6) {
            let currentInputValue = $(this).children().children().val();
            $(this).children().html(currentInputValue);
        }
        if (index == 6) {
            $(this).children().removeClass("newItemDelete").addClass("listDelete");
        }
    });
    $(".newItem").addClass("item").removeClass("newItem");

}


function editItemSuccess(id) {
    showMsg();
    $("#" + id + " th").each(function (index) {
        if (index == 0) {
            $(this).children().removeClass("editCurrentItem fa-save").addClass("listEdit fa-edit");
        }
        if (index != 0 && index != 6) {
            let currentInputValue = $(this).children().children().val();
            $(this).children().html(currentInputValue);
        }
        if (index == 6) {
            $(this).children().removeClass("editItemCancel").addClass("listDelete");
        }
    });
}


let listParameter = ["name", "qtd", "fornecedor", "responsavel", "local"];

function spansToInputs(current) {
    console.log(current);
    $("#" + current + " th").each(function (index) {
        if (index == 0) {
            $(this).children().removeClass("listEdit fa-edit").addClass("editCurrentItem fa-save");
        }
        if (index != 0 && index != 6) {
            let currentValue = $(this).children().html();
            $(this).children().html(`<input type="text" class="` + listParameter[index - 1] + `" value="` + currentValue + `">`);
        }
        if (index == 6) {
            $(this).children().removeClass("listDelete ").addClass("editItemCancel");
        }
    });
}

function showMsg() {
    $(".resultMessageContainer").removeClass("hideSlide");
    setTimeout(function () {
        $(".resultMessageContainer").addClass("hideSlide");
    }, 2500);
}