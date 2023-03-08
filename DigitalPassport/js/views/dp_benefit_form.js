functions.push(function () {


    $('#fsubmit').click(async function () {

        let is_valid = true
        let error_message = []

        let type = $('#type').val()

        // validate mime type
        if (is_valid == true) {

            $('#form_dp_benefit').submit()
        } else {
            error_message = error_message.join("<br />")
            $.alert(error_message)
        }

    });
    $(document).ready(function () {

    });
})