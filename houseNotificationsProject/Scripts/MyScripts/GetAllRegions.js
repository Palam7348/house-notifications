$(function () {
    debugger;
   /* $.ajax({
        url: "http://house-utilities-api.azurewebsites.net/api/regions/getall/key=314",
        dataType: "json",
        method: "GET",
        success: function(regions)
        {
            var content = '';  
            $.each(regions, function (key, value) {
                content += '<li class="MyLi"> <span class="Region-title">' + value.Name +
                    '</span> <button id="' + value.SubRegionId + '" class="StreetButton" data-isOpen="false">=></button>' + '<ul class="sub-category"></ul> </li>'
            });
            $(".List").append(content);*/
    
    $(window).load(function () {
        getStreets();
    });
            
        /*},
        error: function () {
            alert('error');
        }
    });*/
});


function getStreets() {
    $('.StreetButton').click(function () {
        var id = $(this).attr('id');
        var but = this;
        $.ajax({
            url: "http://house-utilities-api.azurewebsites.net/api/streets/getbyregion/key=314,id=" + id,
            dataType: "json",
            method: "GET",
            success: function (streets) {
                var content = '';
                $.each(streets, function (key, value) {
                    content += '<li class="MyLi"> <span class="Street-title">' + value.Name +
                        '</span> <button id="' +
                        value.StreetId + '" class="HouseButton" data-isOpen="false">=></button>' + '<ul class="sub-category"></ul> </li>'
                });               
                if ($(but).attr('data-isOpen') == 'true') {
                    
                    $(but).siblings(".sub-category").html('');

                    $(but).attr('data-isOpen', false);
                } else {
                    $(but).siblings(".sub-category").append(content);
                    $(but).attr('data-isOpen', true);
                    getHouses();                   
                }    
            },
            error: function () {
               // alert('error getStreets');
            }
        });
    });
}


function getHouses() {
    $('.HouseButton').click(function () {
        var id = $(this).attr('id');
        var but = this;
        $.ajax({
            url: "http://house-utilities-api.azurewebsites.net/api/houses/getbystreet/key=314,id=" + id,
            dataType: "json",
            method: "GET",
            success: function (houses) {
                var content = '';
                $.each(houses, function (key, value) {
                    content += '<li class="MyLi"> <span class="House-title"> House ' + value.HouseNumber +
                        '</span> <button id="' +
                        value.HouseId + '" class="PorchButton" data-isOpen="false">=></button>' + '<ul class="sub-category"></ul> </li>'
                });
                if ($(but).attr('data-isOpen') == 'true') {
                    $(but).siblings(".sub-category").html('');

                    $(but).attr('data-isOpen', false);
                } else {
                    $(but).siblings(".sub-category").append(content);
                    $(but).attr('data-isOpen', true);
                    getPorches();
                }               
            },
            error: function () {
               // alert('error getHouses');
            }
        });
    });
}


function getPorches() {
    $('.PorchButton').click(function () {
        var id = $(this).attr('id');
        var but = this;
        $.ajax({
            url: "http://house-utilities-api.azurewebsites.net/api/porches/getbyhouse/key=314,id=" + id,
            dataType: "json",
            method: "GET",
            success: function (porches) {
                var content = '';
                $.each(porches, function (key, value) {
                    content += '<li class="MyLi"> <span class="Porch-title"> Porch ' + value.PorchNumber +
                        '</span> <button id="' +
                        value.PorchId + '" class="ApartmentButton" data-isOpen="false">=></button>' + '<ul class="sub-category"></ul> </li>'
                });

                if ($(but).attr('data-isOpen') == 'true') {
                    $(but).siblings(".sub-category").html('');

                    $(but).attr('data-isOpen', false);
                } else {
                    $(but).siblings(".sub-category").append(content);
                    $(but).attr('data-isOpen', true);
                    getApartments();
                }
                
                //
            },
            error: function () {
               // alert('error getPorches');
            }
        });
    });
}

function getApartments() {
    $('.ApartmentButton').click(function () {
        var id = $(this).attr('id');
        var but = this;
        $.ajax({
            url: "http://house-utilities-api.azurewebsites.net/api/apartments/getbyporch/key=314,id=" + id,
            dataType: "json",
            method: "GET",
            success: function (apartments) {                
                var content = '';
                $.each(apartments, function (key, value) {
                    content += '<li class="MyLi"> <span class="Apartment-title"> Apartment ' + value.ApartmentNumber +
                        '</span></ul> </li>'
                });

                if ($(but).attr('data-isOpen') == 'true') {
                    $(but).siblings(".sub-category").html('');
                    $(but).attr('data-isOpen', false);
                } else {
                    $(but).siblings(".sub-category").append(content);
                    $(but).attr('data-isOpen', true);
                }                
            },
            error: function () {
                //alert('error getApartments');
            }
        });
    });
}