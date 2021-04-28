JSON.parse = JSON.parse || function (str) {
    if (str === "")
        str = '""';
    eval("var p=" + str + ";");
    return p;
};

$(document).ready(function () {
    //Muestra todos los productos METODO GET
    function getProductos() {
        $.ajax({
            url: "http://localhost/slim/api.php/productos",
            type: "get",
            success: function (response) {
                $(".table").html('');
                $.each(JSON.parse(response), function (i, index) {
                    if (index.id.length) {
                        $(".table").append("<tr><th scope='row'>" + index.id + "</th>" +
                            "<td>" + index.name + "</td>" +
                            "<td>" + index.description + "</td>" +
                            "<td>" + index.price + "</td>" +
                            "<td><span class='delete btn btn-danger' data-producto='" + index.id + "'>Borrar</span></td>" +
                            "<td><span class='update btn btn-warning' data-producto='" + index.id + "'>Editar</span></td>" +
                            "</tr>");
                    }
                });


                //Actualizacion
                $(".update").unbind("click").click(function () {
                    $("#id_formUP").val($(this).parents("tr").find("th")[0].innerHTML);
                    $("#name_formUP").val($(this).parents("tr").find("td")[0].innerHTML);
                    $("#description_formUP").val($(this).parents("tr").find("td")[1].innerHTML);
                    $("#price_formUP").val($(this).parents("tr").find("td")[2].innerHTML);
                });

                //Elimina el registro seleccionado METODO DELETE
                $(".delete").unbind("click").click(function () {
                    $.ajax({
                        url: "http://localhost/slim/api.php/productos/" + $(this).data("producto"),
                        type: "delete",
                        success: function (response) {
                            $(".table").html("<thead><tr><th scope='col'>ID</th><th scope='col'>Nombre</th><th scope='col'>Descripcion</th><th scope='col'>Precio</th><th scope='col'>Eliminar</th><th scope='col'>Editar</th></tr></thead>");
                            getProductos();
                            $("#form").attr("data-producto", "0");
                            $("#form")[0].reset();
                        }
                    });
                });
            }
        });
    }
    getProductos();

    
            $("#btnActualizar").click(function () {
                var id = $('#id_formUP').val();
                var nombre = $('#name_formUP').val();
                var descripcion = $('#description_formUP').val();
                var precio = $('#price_formUP').val();

                $.ajax({
                    url: "http://localhost/slim/api.php/productos/" + id,
                    type: "put",
                    data: { id: id, name: nombre, description: descripcion, price: precio },
                    success: function () {

                        getProductos();
                    }
                });



});

    // Guardar productos desde el formulario METODO POST
    if ($("#form").data("producto") === 0) {
        $("#form").submit(function (e) {
            e.preventDefault();

            $.ajax({
                url: "http://localhost/slim/api.php/productos",
                type: "post",
                data: { name: $("#name_form").val(), description: $("#description_form").val(), price: $("#price_form").val() },
                success: function (response) {
                    $(".table").html("<thead><tr><th scope='col'>ID</th><th scope='col'>Nombre</th><th scope='col'>Descripcion</th><th scope='col'>Precio</th><th scope='col'>Eliminar</th><th scope='col'>Editar</th></tr></thead>");

                    getProductos();
                    $("#form")[0].reset();
                }
            });

            return false;
        });

    }
});

