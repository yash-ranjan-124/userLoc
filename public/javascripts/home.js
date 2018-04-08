

var home = function(){
    var table;
    return {
        init:function(){
            google.maps.event.addDomListener(window, 'load', this.searchInit());
            this.dataTableInit();
            this.alignTable();
            this.alignSearchContainer();
            $(window).on('resize',this.alignTable);
            $(window).on('resize',this.alignSearchContainer);

        },
        searchInit:function(){
            var input = document.getElementById('searchTextField');
            var autocomplete = new google.maps.places.Autocomplete(input);
            var self = this;
            google.maps.event.addListener(autocomplete,'place_changed',function(){
                var place = autocomplete.getPlace();
                self.saveSearchData(place);
            });

        },
        dataTableInit:function(){
            table = $('#datatable').DataTable();

        },
        alignTable:function(){
            var screenWidth = $(window).width();
            var tableWidth = $("#table-container").outerWidth(true);
            var positionTable = (screenWidth - tableWidth)/2;
            $("#table-container").css('position','absolute');
            $("#table-container").css('left',positionTable+'px');
        },
        alignSearchContainer:function() {
            var screenWidth = $(window).width();
            var tableWidth = $("#searbox-container").outerWidth(true);
            var positionTable = (screenWidth - tableWidth)/2;
            $("#searbox-container").css('position','absolute');
            $("#searbox-container").css('left',positionTable+'px');
        },
        saveSearchData:function(data){
            var searchName = data.name;
            var address = data.formatted_address;
            var type = data.types[0];
            var latitude = data.geometry.location.lat();
            var longitude = data.geometry.location.lng();
            var placeId = data.place_id;
            var self = this;
            var date = new Date();
            $.ajax({
                url:'/saveSearch',
                dataType:'JSON',
                type:'POST',
                async:true,
                data:{
                    "name":searchName,
                    "address":address,
                    "type":type,
                    "latitude":latitude,
                    "longitude":longitude,
                    "placeId":placeId,
                    "uname":UNAME,
                    "search_date":date.toISOString()
                },
                success:function(res){
                    if(!res['err']){
                        self.showupdatedTableData();
                        table.destroy();
                        setTimeout(function(){
                            self.dataTableInit();
                        },500);


                    }else{
                        console.log(res)
                    }
                },
                error:function(xhr,status,error){
                    console.log(error.message);
                }

            });

        },
        showupdatedTableData:function(){
            $.ajax({
                url:"/getSearch?uname="+UNAME,
                type:"GET",
                dataType:"JSON",
                async:true,
                success:function(res){
                    if(!res['err']){
                        var html="";
                        for(var i=0;i<res.length;i++){
                            html+="<tr><td>"+res[i]['search_name']+"</td>";
                            html+="<td>"+res[i]['address']+"</td>";
                            html+="<td>"+res[i]['type']+"</td>";
                            html+="<td>"+res[i]['latitude']+"</td>";
                            html+="<td>"+res[i]['longitude']+"</td>";
                            html+="<td>"+res[i]['place_id']+"</td>";
                            html+="<td>"+res[i]['search_date']+"</td></tr>";


                        }
                        $("#datatable tbody").append(html);
                    }else{
                        console.log(res);
                    }

                },
                error:function(xhr,status,error){
                    console.log(error);
                }

            });



        },
        diplayInitialTableData:function(){
            $.ajax({
                url:"/getAllSearch?uname="+UNAME,
                type:"GET",
                dataType:"JSON",
                async:true,
                success:function(res){
                    if(!res['err']){
                        var html="";
                        for(var i=0;i<res.length;i++){
                            html+="<tr><td>"+res[i]['search_name']+"</td>";
                            html+="<td>"+res[i]['address']+"</td>";
                            html+="<td>"+res[i]['type']+"</td>";
                            html+="<td>"+res[i]['latitude']+"</td>";
                            html+="<td>"+res[i]['longitude']+"</td>";
                            html+="<td>"+res[i]['place_id']+"</td></tr>";

                        }
                        $("#datatable tbody").append(html);
                    }else{
                        console.log(res);
                    }

                },
                error:function(xhr,status,error){
                    console.log(error.message);
                }

            });



        }

    };
}();
