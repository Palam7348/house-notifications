$(function () {
    debugger;
    $(window).load(function () {
        //getStreets();
    });
});
// TODO Write function loadAllRegions or something to reload all data
$(function () {
    $(document).ready(function () {
        $('#AddRegionButton').on('click', AddRegion);
        $('.DeleteRegionButton').on('click', DeleteRegion);
        $('.StreetAddButton').on('click', AddStreet);
        $('.RegionTh').on('click', getStreets);
        $('.RegionMessageButton').on('click', SendToRegion);
        
    });

function SendToRegion() {
        var id = $(this).attr('id');    //RegionId 
        var Mytr = ($(this).closest('.RowRegion'));
        var but = this;
        var textBoxForMessage = '<tr class="TextBoxForMessage" data-RegionId="' + id + '"><td colspan="6"><label>Enter your message, please: </label> <textarea class="MessageForRegion" cols="40" rows="5"></textarea>' +
        '<button id="' + id + '" class="ButtonForSendingMessage">Send</button></td></tr>';

        if ($(this).attr('data-isOpen') == 'true') {
            $('[class = TextBoxForMessage][data-RegionId = ' + id + ']').remove();
            $(this).attr('data-isOpen', false);
        } else {
            $(textBoxForMessage).insertAfter($(Mytr));
            $(this).attr('data-isOpen', true);
        }

        $('.ButtonForSendingMessage').on('click', function () {
            var Message = $('.MessageForRegion').val();

            var MsgForAPI = "msg=" + Message + "&id=" + id;
            //var array = [{ Message: Message, RegionId: id }];

            $.ajax({
                url: 'http://house-utilities-api.azurewebsites.net/api/regions/send/',
                type: "POST",
                data: JSON.stringify(MsgForAPI),
                dataType: "json",
                contentType: "application/json",
                success: function () {
                    
                    $('[class = TextBoxForMessage][data-RegionId = ' + id + ']').remove();

                    $(but).attr('data-isOpen', false);
                },
                error: function (msg) {
                    // alert('error SendToRegion');
                    $('[class = TextBoxForMessage][data-RegionId = ' + id + ']').remove();

                    $(but).attr('data-isOpen', false);
                }
            });
        });
    }

  

    function AddRegion() {
        var RegionNameToPost = $(".RegionTextBox").val();

        $.ajax({
            url: 'http://house-utilities-api.azurewebsites.net/api/regions/add/',
            type: "POST",
            data: JSON.stringify(RegionNameToPost), // сериализуем данные в JSON объект перед отправкой на сервер.
            dataType: "json",
            contentType: "application/json",
           // headers: {
            //    'key':'6,626 070 040(81) * 10^(-34) J*s'
         //   },
            //позволяет выполнять различные функции, в зависимости от полученного статус-кода
            /*statusCode: {
                201: function () {
                    alert("Created. Имя успешно добавлено в коллекцию.");
                },
                400: function () {
                    alert("Bad Request. Операция не выполнена.");
                }
            },*/

            success: function (data, textStatus, xhr) {
                // data - информация, переданная обратно в теле ответа
                // textStatus - статус операции
                // xhr - обьект XMLHttpRequest

                var ref = $('.RowRegion:last').get();

                var content = '';

                content += '<tr class="RowRegion" data-RegionId="' + data.SubRegionId + '">' +
                    '<th id="' + data.SubRegionId + '" data-isOpen="false" class="RegionTh"><img src="/Images/ArrowRight.png" class="RegionImage"/>' + data.Name + '</th>' +
                    '<td colspan="4">Region Description</td>' +
                    '<td><img src="/Images/mail.png" class="RegionMessageButton" alt="Отправить уведомлению этому району" title="Отправить уведомлению этому району" id="' + data.SubRegionId + '" data-isOpen="false"/>' +
                    '<img src="/Images/add.png" class="StreetAddButton" alt="Add street" title="Add street" id="' + data.SubRegionId + ' data-isOpen="false"/>' +
                    '<img src="/Images/delete.png" class="DeleteRegionButton" alt="DeleteRegion" title="Delete region" id="' + data.SubRegionId + '"></td>' +
                    '</tr>';

                $(content).insertAfter($(ref));

                $('.StreetAddButton').on('click', AddStreet);
                $('.DeleteRegionButton').on('click', DeleteRegion);
                $('.RegionMessageButton').on('click', SendToRegion);

                $('.RegionTextBox').val("");
            },

            error: function () {
                alert('error AddRegion');
            }
        });
    }
    
});

function DeleteRegion() {
    var id = $(this).attr('id');
    var Mytr = $(this).closest('.RowRegion');
    $.ajax({
        url: 'http://house-utilities-api.azurewebsites.net/api/regions/delete/',
        type: "DELETE",
        data: JSON.stringify(id), // сериализуем данные в JSON объект перед отправкой на сервер.
        dataType: "json",
        contentType: "application/json",
        success: function () {
            Mytr.remove();
        },
        error: function () {
            Mytr.remove();
        }
    });
}



function AddStreet() {
    var id = $(this).attr('id');    //RegionId
    
    var Mytr = ($(this).closest('.RowRegion'));
    var ref = Mytr.children('.RegionTh');
    var contentForAdding = '<tr class="AddStreetTr" data-RegionId="' + id + '"><td colspan="6"><label>Add Street</label> <input type="text" class="StreetTextBox"/>' +
        '<button id="' + id + '" class="TextboxButtonForStreet">Add Street</button></td></tr>';
    var but = this;
    if ($(this).attr('data-isOpen') == 'true')
    {
        $('.AddStreetTr').remove();
        $(this).attr('data-isOpen', false);
    } else {
        $(contentForAdding).insertAfter($(Mytr));
        $(this).attr('data-isOpen', true);
    }

    $('.TextboxButtonForStreet').on('click', function () {
        var AddTr = ($(this).closest('.AddStreetTr'));
        var StreetName = $('.StreetTextBox').val();
        var RegId = $('.TextboxButtonForStreet').attr('id');
        var array = [{ SubRegionId: RegId, StreetId: 0, Name: StreetName }];
        $.ajax({
            url: 'http://house-utilities-api.azurewebsites.net/api/streets/add/',
            type: "POST",
            data: JSON.stringify(array),
            dataType: "json",
            contentType: "application/json",
            success: function (street) {
                AddTr.remove();
                $('[class = RowStreet][data-RegionId = ' + id + ']').remove();
                /////////to rewrite this code later////////////
                $.ajax({
                    url: "http://house-utilities-api.azurewebsites.net/api/streets/getbyregion/key=314,id=" + id,
                    dataType: "json",
                    method: "GET",
                    success: function (streets) {

                        var content = '';

                        $.each(streets, function (key, value) {
                            content += '<tr class="RowStreet" data-RegionId="' + id + '"><td></td>' +
                                '<th id="' + value.StreetId + '" data-isOpen="false"  class="StreetTh" data-RegionId="' + id + '"><img src="/Images/ArrowRight.png" class="StreetImage"/>' + value.Name + '</th>' +
                                '<td colspan="3">Street Description</td>' +
                                '<td><img src="/Images/mail.png" class="StreetMessageButton" alt="Send message" title="Send message to this street"/>' +
                                '<img src="/Images/add.png" class="HouseAddButton" alt="Add House" title="Add house" id="' + value.StreetId + '" data-isOpen="false"/>' +
                                '<img src="/Images/delete.png" class="DeleteStreetButton" alt="DeleteStreet" title="Delete street" id="' + value.StreetId + '"></td></tr>'
                        });


                      //      $(RegionImageRef).css('transform', 'rotate(90deg)');

                            $(content).insertAfter($(Mytr));
                            $('.DeleteStreetButton').on('click', DeleteStreet);
                            $('.HouseAddButton').on('click', AddHouse);

                            $(ref).attr('data-isOpen', true);
                            $('[class = StreetTh][data-RegionId = ' + id + ']').on('click', getHouses);
                       // }
                    },
                    error: function () {
                        alert('error getStreets in adding a street to region');
                    }
                });

                $(but).attr('data-isOpen', false);                
            },
            error: function () {
                alert('error AddStreet');
            }
        });
    });   
}

function DeleteStreet() {
    var id = $(this).attr('id');

    var Mytr = ($(this).closest('.RowStreet'));
    $.ajax({
        url: 'http://house-utilities-api.azurewebsites.net/api/streets/delete/',
        type: "DELETE",
        data: JSON.stringify(id), // сериализуем данные в JSON объект перед отправкой на сервер.
        dataType: "json",
        contentType: "application/json",
        success: function () {
            Mytr.remove();
            //location.reload();
        },
        // I'm sorry for this code
        error: function () {
            Mytr.remove();
        }
    });
}

function AddHouse() {
    var id = $(this).attr('id');    //StreetId
    var RegionId = $(this).closest('.RowStreet').attr('data-RegionId');
    var Mytr = ($(this).closest('.RowStreet'));
    var contentForAdding = '<tr class="AddHouseTr" data-StreetId="' + id + '" data-RegionId="' + RegionId + '"><td colspan="6"><label>Add House</label> <input type="text" class="HouseTextBox"/>' +
        '<button id="' + id + '" class="TextboxButtonForHouse">Add House</button></td></tr>';
    var but = this;
    if ($(this).attr('data-isOpen') == 'true') {
        $('.AddHouseTr').remove();
        $(this).attr('data-isOpen', false);
    } else {
        $(contentForAdding).insertAfter($(Mytr));
        $(this).attr('data-isOpen', true);
    }

    $('.TextboxButtonForHouse').on('click', function () {
        var AddTr = ($(this).closest('.AddHouseTr'));
        var HouseNumber = $('.HouseTextBox').val();
        var StreetId = $('.TextboxButtonForHouse').attr('id');
        var array = [{ StreetId: StreetId, HouseId: 0, HouseNumber: HouseNumber }];
        $.ajax({
            url: 'http://house-utilities-api.azurewebsites.net/api/houses/add/',
            type: "POST",
            data: JSON.stringify(array),
            dataType: "json",
            contentType: "application/json",
            success: function (house) {
                AddTr.remove();
                $(but).attr('data-isOpen', false);
            },
            error: function () {
                alert('error AddHouse');
            }
        });
    });
}

function DeleteHouse() {
    var id = $(this).attr('id');

    var Mytr = ($(this).closest('.RowHouse'));
    $.ajax({
        url: 'http://house-utilities-api.azurewebsites.net/api/houses/delete/',
        type: "DELETE",
        data: JSON.stringify(id), // сериализуем данные в JSON объект перед отправкой на сервер.
        dataType: "json",
        contentType: "application/json",
        success: function () {
            Mytr.remove();
            //location.reload();
        },
        // I'm sorry for this code
        error: function () {
            Mytr.remove();
        }
    });
}

function AddPorch() {
    var id = $(this).attr('id');    //HouseId
    var RegionId = $(this).closest('.RowHouse').attr('data-RegionId');
    var StreetId = $(this).closest('.RowHouse').attr('data-StreetId');
    var Mytr = ($(this).closest('.RowHouse'));
    var contentForAdding = '<tr class="AddPorchTr" data-HouseId="' + id + '" data-RegionId="' + RegionId +
                        '" data-StreetId="' + StreetId + '"><td colspan="6"><label>Add Porch</label> <input type="text" class="PorchTextBox"/>' +
        '<button id="' + id + '" class="TextboxButtonForPorch">Add Porch</button></td></tr>';
    var but = this;
    if ($(this).attr('data-isOpen') == 'true') {
        $('.AddPorchTr').remove();
        $(this).attr('data-isOpen', false);
    } else {
        $(contentForAdding).insertAfter($(Mytr));
        $(this).attr('data-isOpen', true);
    }

    $('.TextboxButtonForPorch').on('click', function () {
        var AddTr = $(this).closest('.AddPorchTr');
        var PorchNumber = $('.PorchTextBox').val();
        var HouseId = $('.TextboxButtonForPorch').attr('id');
        var array = [{ HouseId: HouseId, PorchId: 0, PorchNumber: PorchNumber }];
        $.ajax({
            url: 'http://house-utilities-api.azurewebsites.net/api/porches/add/',
            type: "POST",
            data: JSON.stringify(array),
            dataType: "json",
            contentType: "application/json",
            success: function () {
                AddTr.remove();
                $(but).attr('data-isOpen', false);
            },
            error: function () {
                alert('error AddHouse');
            }
        });
    });
}

function DeletePorch() {
    var id = $(this).attr('id');

    var Mytr = ($(this).closest('.RowPorch'));
    $.ajax({
        url: 'http://house-utilities-api.azurewebsites.net/api/porches/delete/',
        type: "DELETE",
        data: JSON.stringify(id), // сериализуем данные в JSON объект перед отправкой на сервер.
        dataType: "json",
        contentType: "application/json",
        success: function () {
            Mytr.remove();
            //location.reload();
        },
        // I'm sorry for this code
        error: function () {
            Mytr.remove();
        }
    });
}

function DeleteApartment() {
    var id = $(this).attr('id');

    var Mytr = ($(this).closest('.RowApartment'));
    $.ajax({
        url: 'http://house-utilities-api.azurewebsites.net/api/apartments/delete/',
        type: "DELETE",
        data: JSON.stringify(id), // сериализуем данные в JSON объект перед отправкой на сервер.
        dataType: "json",
        contentType: "application/json",
        success: function () {
            Mytr.remove();
            //location.reload();
        },
        // I'm sorry for this code
        error: function () {
            Mytr.remove();
        }
    });
}

function AddApartment() {
    var id = $(this).attr('id');    //PorchId
    var RegionId = $(this).closest('.RowPorch').attr('data-RegionId');
    var StreetId = $(this).closest('.RowPorch').attr('data-StreetId');
    var HouseId = $(this).closest('.RowPorch').attr('data-HouseId');
    var Mytr = ($(this).closest('.RowPorch'));
    var contentForAdding = '<tr class="AddApartmentTr" data-PorchId="' + id + '" data-RegionId="' + RegionId +
                        '" data-StreetId="' + StreetId + '" data-HouseId="' + HouseId + '"><td colspan="6"><label>Add Apartment Number</label> <input type="text" class="ApartmentTextBox"/>' +
        '<br>' + 
        '<label>Add Apartment Owner Telephone number: </label>  <input type="text" class="ApartmentTextBoxForTelephone"/>' + 
        '<button id="' + id + '" class="OwnerTelNumber">Add</button></td></tr>';
    var but = this;
    if ($(this).attr('data-isOpen') == 'true') {
        $('.AddApartmentTr').remove();
        $(this).attr('data-isOpen', false);
    } else {
        $(contentForAdding).insertAfter($(Mytr));
        $(this).attr('data-isOpen', true);
    }

    $('.OwnerTelNumber').on('click', function () {
        var AddTr = $(but).closest('.AddApartmentTr');
        var ApartmentNumber = $('.ApartmentTextBox').val();
        var PorchId = $('.OwnerTelNumber').attr('id');
        var OwnerTelephoneNumber = $('.ApartmentTextBoxForTelephone').val();
        var array = [{ ApartmentNumber: ApartmentNumber, ApartmentId: 0, PorchId: PorchId, OwnerTelephoneNumber: OwnerTelephoneNumber }];
        $.ajax({
            url: 'http://house-utilities-api.azurewebsites.net/api/apartments/add/',
            type: "POST",
            data: JSON.stringify(array),
            dataType: "json",
            contentType: "application/json",
            success: function () {
                $('.AddApartmentTr').remove();
                $(but).attr('data-isOpen', false);
            },
            error: function () {
                alert('error AddApartment');
            }
        });
    });
}

function getStreets() {

        var id = $(this).attr('id');   // Region ID
        var but = this;
        var Mytr = ($(but).closest('.RowRegion'));
        var RegionImageRef = $(this).children('.RegionImage');

        $.ajax({
            url: "http://house-utilities-api.azurewebsites.net/api/streets/getbyregion/key=314,id=" + id,
            dataType: "json",
            method: "GET",
            success: function (streets) {

                var content = '';

                $.each(streets, function (key, value) {
                    content += '<tr class="RowStreet" data-RegionId="' + id + '" ><td></td>' + 
                        '<th id="' + value.StreetId + '" data-isOpen="false"  class="StreetTh" data-RegionId="' + id + '"><img src="/Images/ArrowRight.png" class="StreetImage"/>' + value.Name + '</th>' +
                        '<td colspan="3">Street Description</td>' + 
                        '<td><img src="/Images/mail.png" class="StreetMessageButton" alt="Send message" title="Send message to this street" id="' + value.StreetId + '"  data-isOpen="false" data-RegionId="' + id + '"/>' +
                        '<img src="/Images/add.png" class="HouseAddButton" alt="Add House" title="Add house" id="' + value.StreetId + '" data-isOpen="false"/>' +
                        '<img src="/Images/delete.png" class="DeleteStreetButton" alt="DeleteStreet" title="Delete street" id="'+ value.StreetId + '"></td></tr>'
                });
                
                if ($(but).attr('data-isOpen') == 'true') {
                    
                    $('[class = RowStreet][data-RegionId = ' + id + ']').remove();
                    $('[class = RowHouse][data-RegionId = ' + id + ']').remove();
                    $('[class = RowPorch][data-RegionId = ' + id + ']').remove();
                    $('[class = RowApartment][data-RegionId = ' + id + ']').remove();


                    $(RegionImageRef).css('transform', 'rotate(360deg)');
                    $(but).attr('data-isOpen', false);
                } else {
                    $(RegionImageRef).css('transform', 'rotate(90deg)');
                    
                    $(content).insertAfter($(Mytr));
                    $('.DeleteStreetButton').on('click', DeleteStreet);
                    $('.HouseAddButton').on('click', AddHouse);
                    $('.StreetMessageButton').on('click', SendToStreet);

                    $(but).attr('data-isOpen', true);
                    $('[class = StreetTh][data-RegionId = ' + id + ']').on('click', getHouses);
                    
                    //$('[class = StreetMessageButton][data-RegionId = ' + id + ']').on('click', SendToStreet);
                   // $('.StreetTh').on('click', getHouses);
                }
            },
            error: function () {
                alert('error getStreets');
            }
        });
   
}


function getHouses() {
   

        var id = $(this).attr('id');  //Street ID
        var RegionId = $(this).closest('.RowStreet').attr('data-RegionId');
        var but = this;
        var Mytr = ($(but).closest('.RowStreet'));
        var RegionImageRef = $(this).children('.StreetImage');

        $.ajax({
            url: "http://house-utilities-api.azurewebsites.net/api/houses/getbystreet/key=314,id=" + id,
            dataType: "json",
            method: "GET",
            success: function (houses) {

                var content = '';

                $.each(houses, function (key, value) {
                    content += '<tr class="RowHouse" data-StreetId="' + id + '" data-RegionId="' + RegionId + '" ><td></td><td></td>' +
                        '<th id="' + value.HouseId + '" data-isOpen="false"  class="HouseTh" data-StreetId="' + id + '"><img src="/Images/ArrowRight.png" class="HouseImage"/>' + value.HouseNumber + '</th>' +
                        '<td colspan="2">House Description</td>' +
                        '<td><img src="/Images/mail.png" class="HouseMessageButton" alt="Send message" title="Send message to this house" id="' + value.HouseId + '" data-isOpen="false"/>' +
                        '<img src="/Images/add.png" class="PorchAddButton" alt="Add Porch" title="Add porch" id="' + value.HouseId + '" data-isOpen="false"/>' +
                        '<img src="/Images/delete.png" class="DeleteHouseButton" alt="DeleteHouse" title="Delete house" id="' + value.HouseId + '"></td></tr>'
                });

                if ($(but).attr('data-isOpen') == 'true') {
                    $('[class = RowHouse][data-StreetId = ' + id + ']').remove();
                    $('[class = RowPorch][data-StreetId = ' + id + ']').remove();
                    $('[class = RowApartment][data-StreetId = ' + id + ']').remove();
                    $(RegionImageRef).css('transform', 'rotate(360deg)');
                    $(but).attr('data-isOpen', false);
                } else {
                    $(RegionImageRef).css('transform', 'rotate(90deg)');
                    $(content).insertAfter($(Mytr));
                    $('.DeleteHouseButton').on('click', DeleteHouse);
                    $('.PorchAddButton').on('click', AddPorch);
                    $('.HouseMessageButton').on('click', SendToHouse);
                    $(but).attr('data-isOpen', true);
                    // $('.HouseTh').on('click', getPorches);
                    $('[class = HouseTh][data-StreetId = ' + id + ']').on('click', getPorches);
                    
                }    
            },
            error: function () {
                alert('error getHouses');
            }
        });
  
}


function getPorches() {
    
        var id = $(this).attr('id');
        var RegionId = $(this).closest('.RowHouse').attr('data-RegionId');
        var StreetId = $(this).closest('.RowHouse').attr('data-StreetId');
        var RegionImageRef = $(this).children('.HouseImage');

        var but = this;
        var Mytr = ($(but).closest('.RowHouse'));

        $.ajax({
            url: "http://house-utilities-api.azurewebsites.net/api/porches/getbyhouse/key=314,id=" + id,
            dataType: "json",
            method: "GET",
            success: function (porches) {

                var content = '';

                $.each(porches, function (key, value) {
                    content += '<tr class="RowPorch" data-HouseId="' + id + '" data-RegionId="' + RegionId +
                        '" data-StreetId="' + StreetId + '" ><td></td><td></td><td></td>' +
                        '<th id="' + value.PorchId + '" data-isOpen="false"  class="PorchTh" data-HouseId="' + id + '"><img src="/Images/ArrowRight.png" class="PorchImage"/>' + value.PorchNumber + '</th>' +
                        '<td colspan="1">Porch Description</td>' +
                        '<td><img src="/Images/mail.png" class="PorchMessageButton" alt="Send message" title="Send message to this porch" id="' + value.PorchId + '" data-isOpen="false"/>' +
                        '<img src="/Images/add.png" class="ApartmentAddButton" alt="Add apartment" title="Add apartment" id="' + value.PorchId + '" data-isOpen="false"/>' +
                        '<img src="/Images/delete.png" class="DeletePorchButton" alt="DeletePorch" title="Delete porch" id="' + value.PorchId + '"></td></tr>'
                });

                if ($(but).attr('data-isOpen') == 'true') {

                    $('[class = RowPorch][data-HouseId = ' + id + ']').remove();
                    $('[class = RowApartment][data-HouseId = ' + id + ']').remove();

                    $(RegionImageRef).css('transform', 'rotate(360deg)');
                    $(but).attr('data-isOpen', false);
                } else {


                    $(RegionImageRef).css('transform', 'rotate(90deg)');


                    $(content).insertAfter($(Mytr));
                    $('.DeletePorchButton').on('click', DeletePorch);
                    $('.ApartmentAddButton').on('click', AddApartment);
                    $('.PorchMessageButton').on('click', SendToPorch);
                    $(but).attr('data-isOpen', true);
                    // $('.PorchTh').on('click', getApartments);
                    $('[class = PorchTh][data-HouseId = ' + id + ']').on('click', getApartments);
                    
                }
                
            },
            error: function () {
                alert('error getPorches');
            }
        });
    
}

function getApartments() {
   
        var id = $(this).attr('id');
        var RegionId = $(this).closest('.RowPorch').attr('data-RegionId');
        var StreetId = $(this).closest('.RowPorch').attr('data-StreetId');
        var HouseId = $(this).closest('.RowPorch').attr('data-HouseId');
        var RegionImageRef = $(this).children('.PorchImage');
        
        
        var but = this;
        var Mytr = ($(but).closest('.RowPorch'));

        $.ajax({
            url: "http://house-utilities-api.azurewebsites.net/api/apartments/getbyporch/key=314,id=" + id,
            dataType: "json",
            method: "GET",
            success: function (apartments) {

                var content = '';

                $.each(apartments, function (key, value) {
                    content += '<tr class="RowApartment" data-PorchId="' + id + '" data-RegionId="' + RegionId +
                        '" data-StreetId="' + StreetId + '" data-HouseId="' + HouseId + '" ><td></td><td></td><td></td><td></td>' +
                        '<th id="' + value.ApartmentId + '" data-isOpen="false"  class="ApartmentTh" data-PorchId="' + id + '">'
                        + value.ApartmentNumber + '</th>' +
                        '<td><img src="/Images/mail.png" class="ApartmentMessageButton" alt="Send message" title="Send message to this apartment" id="' + value.ApartmentId + '" data-isOpen="false"/>' +
                        '<img src="/Images/delete.png" class="DeleteApartmentButton" alt="DeleteApartment" title="Delete Apartment" id="' + value.ApartmentId + '"></td></tr>'
                });

                if ($(but).attr('data-isOpen') == 'true') {

                    $('[class = RowApartment][data-PorchId = ' + id + ']').remove();

                    $(RegionImageRef).css('transform', 'rotate(360deg)');
                    $(but).attr('data-isOpen', false);
                } else {


                    $(RegionImageRef).css('transform', 'rotate(90deg)');

                    
                    $(content).insertAfter($(Mytr));
                    $('.DeleteApartmentButton').on('click', DeleteApartment);
                    $('.ApartmentMessageButton').on('click', SendToApartment);
                    $(but).attr('data-isOpen', true);
                    
                }
            },
            error: function () {
                alert('error getApartments');
            }
        });
}

function SendToStreet() {
    var id = $(this).attr('id');    //StreetId 
    var Mytr = ($(this).closest('.RowStreet'));
    var but = this;
    var textBoxForMessage = '<tr class="TextBoxForMessage" data-StreetId="' + id + '"><td colspan="6"><label>Enter your message, please: </label> <textarea class="MessageForStreet" cols="40" rows="5"></textarea>' +
    '<button id="' + id + '" class="ButtonForSendingMessage">Send</button></td></tr>';

    if ($(this).attr('data-isOpen') == 'true') {
        $('[class = TextBoxForMessage][data-StreetId = ' + id + ']').remove();
        $(this).attr('data-isOpen', false);
    } else {
        $(textBoxForMessage).insertAfter($(Mytr));
        $(this).attr('data-isOpen', true);
    }

    $('.ButtonForSendingMessage').on('click', function () {
        var Message = $('.MessageForStreet').val();
        var MsgForAPI = "msg=" + Message + "&id=" + id;

        $.ajax({
            url: 'http://house-utilities-api.azurewebsites.net/api/streets/send/',
            type: "POST",
            data: JSON.stringify(MsgForAPI),
            dataType: "json",
            contentType: "application/json",
            success: function () {

                $('[class = TextBoxForMessage][data-StreetId = ' + id + ']').remove();

                $(but).attr('data-isOpen', false);
            },
            error: function () {
                // alert('error SendToStreet');
                $('[class = TextBoxForMessage][data-StreetId = ' + id + ']').remove();

                $(but).attr('data-isOpen', false);
            }
        });
    });
}

function SendToHouse() {
    var id = $(this).attr('id');    //HouseId 
    var Mytr = ($(this).closest('.RowHouse'));
    var but = this;
    var textBoxForMessage = '<tr class="TextBoxForMessage" data-HouseId="' + id + '"><td colspan="6"><label>Enter your message, please: </label> <textarea class="MessageForHouse" cols="40" rows="5"></textarea>' +
    '<button id="' + id + '" class="ButtonForSendingMessage">Send</button></td></tr>';

    if ($(this).attr('data-isOpen') == 'true') {
        $('[class = TextBoxForMessage][data-HouseId = ' + id + ']').remove();
        $(this).attr('data-isOpen', false);
    } else {
        $(textBoxForMessage).insertAfter($(Mytr));
        $(this).attr('data-isOpen', true);
    }

    $('.ButtonForSendingMessage').on('click', function () {
        var Message = $('.MessageForHouse').val();
        var MsgForAPI = "msg=" + Message + "&id=" + id;

        $.ajax({
            url: 'http://house-utilities-api.azurewebsites.net/api/houses/send/',
            type: "POST",
            data: JSON.stringify(MsgForAPI),
            dataType: "json",
            contentType: "application/json",
            success: function () {

                $('[class = TextBoxForMessage][data-HouseId = ' + id + ']').remove();

                $(but).attr('data-isOpen', false);
            },
            error: function () {
                // alert('error SendToHouse');
                $('[class = TextBoxForMessage][data-HouseId = ' + id + ']').remove();

                $(but).attr('data-isOpen', false);
            }
        });
    });
}

function SendToPorch() {
    var id = $(this).attr('id');    //PorchId 
    var Mytr = ($(this).closest('.RowPorch'));
    var but = this;
    var textBoxForMessage = '<tr class="TextBoxForMessage" data-PorchId="' + id + '"><td colspan="6"><label>Enter your message, please: </label> <textarea class="MessageForPorch" cols="40" rows="5"></textarea>' +
    '<button id="' + id + '" class="ButtonForSendingMessage">Send</button></td></tr>';

    if ($(this).attr('data-isOpen') == 'true') {
        $('[class = TextBoxForMessage][data-PorchId = ' + id + ']').remove();
        $(this).attr('data-isOpen', false);
    } else {
        $(textBoxForMessage).insertAfter($(Mytr));
        $(this).attr('data-isOpen', true);
    }

    $('.ButtonForSendingMessage').on('click', function () {
        var Message = $('.MessageForPorch').val();
        var MsgForAPI = "msg=" + Message + "&id=" + id;

        $.ajax({
            url: 'http://house-utilities-api.azurewebsites.net/api/porches/send/',
            type: "POST",
            data: JSON.stringify(MsgForAPI),
            dataType: "json",
            contentType: "application/json",
            success: function () {

                $('[class = TextBoxForMessage][data-PorchId = ' + id + ']').remove();

                $(but).attr('data-isOpen', false);
            },
            error: function () {
                // alert('error SendToPorch');
                $('[class = TextBoxForMessage][data-PorchId = ' + id + ']').remove();

                $(but).attr('data-isOpen', false);
            }
        });
    });
}

function SendToApartment() {
    var id = $(this).attr('id');    //ApartmentId 
    var Mytr = ($(this).closest('.RowApartment'));
    var but = this;
    var textBoxForMessage = '<tr class="TextBoxForMessage" data-ApartmentId="' + id + '"><td colspan="6"><label>Enter your message, please: </label> <textarea class="MessageForApartment" cols="40" rows="5"></textarea>' +
    '<button id="' + id + '" class="ButtonForSendingMessage">Send</button></td></tr>';

    if ($(this).attr('data-isOpen') == 'true') {
        $('[class = TextBoxForMessage][data-ApartmentId = ' + id + ']').remove();
        $(this).attr('data-isOpen', false);
    } else {
        $(textBoxForMessage).insertAfter($(Mytr));
        $(this).attr('data-isOpen', true);
    }

    $('.ButtonForSendingMessage').on('click', function () {
        var Message = $('.MessageForApartment').val();
        var MsgForAPI = "msg=" + Message + "&id=" + id;

        $.ajax({
            url: 'http://house-utilities-api.azurewebsites.net/api/apartments/send/',
            type: "POST",
            data: JSON.stringify(MsgForAPI),
            dataType: "json",
            contentType: "application/json",
            success: function () {

                $('[class = TextBoxForMessage][data-ApartmentId= ' + id + ']').remove();

                $(but).attr('data-isOpen', false);
            },
            error: function () {
                //  alert('error SendToApartment');
                $('[class = TextBoxForMessage][data-ApartmentId = ' + id + ']').remove();

                $(but).attr('data-isOpen', false);
            }
        });
    });
}