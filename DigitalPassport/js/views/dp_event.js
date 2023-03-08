let table = null

function afterSubmit(response) {
    $('#formModal').modal('toggle')
    if (response.error && response.error.code) {
        $.alert(response.error.message)
        return
    }

    $.info(response.data.message)
    if (table != null && table.ajax != undefined) {
        table.ajax.reload(null, false)
    }
}

function _btnActionString() {
    let btnGroup = `<div class="btn-group">
        <button data-toggle="dropdown" class="btn btn-default">Action<b class="caret icon-text-r"></b></button>
        <ul role="menu" class="dropdown-menu dropdown-menu-r">
        </ul>
    </div>`;

    let actionEditUrl = "/cms/dp_event/detail/"
    let btnEdit = (!_action_lookup.edit) ? "" : `<li><a href="#" class="btn-act" act-type="edit-modal" params="id" act-url="` + actionEditUrl + `"><em class="fa fa-pencil icon-text-l"></em>Edit</a></li>`;
    let btnDelete = (!_action_lookup.delete) ? "" : `<li><a href="#" class="btn-act" act-type="del"><em class="fa fa-trash-o icon-text-l"></em>Delete</a>`;
    let btnActionCollection = [
        btnEdit, btnDelete
    ].filter(row => row != "")

    let $htmlDropdown = $(btnGroup)
        .find(".dropdown-menu.dropdown-menu-r")

    btnActionCollection.map(function (row) {
        $htmlDropdown = $htmlDropdown.append(row)
    })
    $htmlDropdown = $htmlDropdown.end()

    return (btnActionCollection.length) ? $htmlDropdown[0].outerHTML : ""
}


functions.push(function () {
    let btnAct = _btnActionString();

    table = $('#datatable_content').DataTable({
        'paging': true, // Table pagination
        'ordering': true, // Column ordering
        'info': true, // Bottom left status text
        'responsive': true, // https://datatables.net/extensions/responsive/examples/
        'processing': true,
        'serverSide': true,
        ajax: {
            url: "/cms/dp_event",
            type: "POST",
            data: function (d) {
                d.marlboro_csrf = $("[name='marlboro_csrf']").val()
            }
        },
        columns: [{
            data: "id",
            title: "id",
            visible: false,
            width: "10%",
          },
          {
            data: "title",
            title: "Title",
            width: "5%",
          },
          {
            data: "short_desc",
            title: "Short Description",
            width: "15%",
          },
        //   {
        //     data: "icon",
        //     title: "Icon",
        //     sortable: false,
        //     width: "20%",
        //   },
          {
            data: "image_banner",
            title: "Image Banner",
            sortable: false,
            width: "20%",
          },
          {
            data: "event_date",
            title: "Event Start Date",
            width: "10%",
          },
          {
            data: "event_end_date",
            title: "Event End Date",
            width: "10%",
          },
          {
            data: "event_location",
            title: "Event Location",
            width: "10%",
          },
          {
            data: "status",
            title: "Status",
            width: "5%",
          },
          {
            data: null,
            defaultContent: btnAct,
            title: "Action",
            width: "10%",
            sortable: false,
          },
        ],
        "order": [
            [0, "desc"]
        ],
        "dom": '<"toolbar">lfrtip'
    });

    $('.datatable_act tbody').on('click', '.btn-act', function (e) {
        e.preventDefault();
        let actType = $(this).attr('act-type')
        let currentRow = $(this).parents('tr')
        if (currentRow.attr("class") == "child") {
            currentRow = currentRow.prev()
        }
        let currentRowData = table.row(currentRow)
        let dataRow = currentRowData.data()
        if (actType == "del") {
            swal({
                title: "Are you sure?",
                text: "Are you sure that you want to delete this item?",
                type: "warning",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: "Yes, delete it!",
                confirmButtonColor: "#ec6c62"
            }, function () {
                $.ajax({
                    type: "post",
                    url: "/cms/dp_event/destroy",
                    data: {
                        marlboro_csrf: $("[name='marlboro_csrf']").val(),
                        id: dataRow.id
                    },
                    success: function (data) {
                        if (data.error.code === undefined) {
                            swal({
                                title: "Deleted!",
                                text: "Your item was successfully deleted!",
                                type: "success"
                            }, function () {
                                // Reload Table
                                // table.fnReloadAjax();
                                table.ajax.reload(null, false)
                            });
                        } else {
                            if (data.error) {
                                swal("Oops", data.error.message, "error")
                            } else {
                                swal("Oops", "An error has occurred!", "error");
                            }
                        }
                    },
                    error: function () {
                        swal("Oops", "An error has occurred!", "error");
                    }
                })
            });
        } else if (actType == "edit-modal") {
            let actUrl = $(this).attr('act-url') + dataRow.id
            $(location).attr("href", actUrl);
        }
    });

    if (_action_lookup.add) {
        $("div.toolbar").html('<button title="Add New" class="btn btn-colonies btn-sm btn-add"><span class="icon-span-filestyle fa fa-plus icon-text-l"></span><span>Add New</span></button>');
    }

    $('.btn-add').click(function () {
        let url = $("#datatable_content").attr('form-url');
        window.location.href = base_path + url;
    });

});