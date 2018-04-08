
var appLogReg = function(){
    return {
        init:function(){

        },
        getlogin:function(formdata){
            if(appLogReg.validateLoginData(formdata)){
                var username = formdata[0]['value'];
                var password = formdata[1]['value'];
                $.ajax({
                    url:"/login",
                    dataType:"JSON",
                    type:"POST",
                    data:{
                        "username":username,
                        "password":password
                    },
                    async:true,
                    success:function(res){
                        if(res['error']){
                            $("#login-alert").html(res['error']);
                            $("#login-alert").show();
                        }else{
                            appLogReg.setCookie('acc_tkn',res,1);
                            window.location.href = "/home";
                        }
                    },
                    error:function(xhr,status,error){
                        console.log(error.message);
                    }
                })
            }else{
                return false;
            }


        },
        validateLoginData:function(formdata){
            var usernameRegex = /^[a-zA-Z0-9@\.]+$/;
            if(!formdata){
                $("#login-alert").html("username and password is required!!");
                $("#login-alert").show();
                return false;
            }
            else{
                var flag = false;
                if(formdata[0]['value'] == "" && formdata[1]['value']==""){
                    $("#login-alert").html("username & password can't be empty!");
                    $("#login-alert").show();
                    return false;
                }
                if(formdata[0]['value'] && formdata[0]['value']!=""){
                    flag=true;
                }else{
                    $("#login-alert").html("username can't be empty!");
                    $("#login-alert").show();
                    return false;
                }
                 if(formdata[1]['value'] && formdata[1]['value']!=""){
                    flag = true;
                }else{
                    $("#login-alert").html("password can't be empty!");
                    $("#login-alert").show();
                    return false;
                }


                return flag;

            }


        },
        registerUser:function(formdata){
             var valid = appLogReg.validateRegisterData(formdata);
            if(valid){
                var postdata={};
                for(var i=0;i<formdata.length;i++){
                    postdata[formdata[i]['name']] = formdata[i]['value'];
                }
                $.ajax({
                    url:"/register",
                    type:"POST",
                    dataType:"JSON",
                    async:true,
                    data:postdata,
                    success:function(res){
                        if(res['success']){
                            $("#signupalert_success span").html(res['success']);
                            $("#signupalert_success").show();

                        }else{
                            $("#signupalert span").html(res['error']);
                            $("#signupalert").show();
                        }
                    },
                    error:function(xhr,status,error){
                        console.log(error.message);
                    }

                });
            }
            else{
                return false;
            }
        },
        validateRegisterData:function(formdata){
            if(formdata[0]['value'] !="" && formdata[1]['value'] !="" && formdata[2]['value'] !="" && formdata[4]['value'] !="" ){
                var emailRegEx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                var usernameRegEx = /^[a-zA-Z0-9@_\.]+$/;
                var nameRegEx = /^[a-zA-Z]+$/;
                var valid_flag=[];
                if(formdata[0]['value'].match(emailRegEx)){
                    valid_flag[0] = true;
                }else{
                    $("#signupalert").html("email invalid!");
                    $("#signupalert").show();
                    valid_flag[0] = false;
                }

                if(formdata[1]['value'].match(usernameRegEx)){
                    valid_flag[1] = true;
                }else{
                    $("#signupalert").html("username can have [digits,alphabets or sepecial chars(@,.,_)!");
                    $("#signupalert").show();
                    valid_flag[1] = false;
                }

                if(formdata[2]['value'].match(nameRegEx)){
                    valid_flag[2] = true;
                }else{
                    $("#signupalert").html("first name can only have alphabets");
                    $("#signupalert").show();
                    valid_flag[2] = false;
                }

                if(formdata[3]['value'].match(nameRegEx)){
                    valid_flag[3] = true;
                }else{
                    $("#signupalert").html("last name can only have alphabets");
                    $("#signupalert").show();
                    valid_flag[3] = false;
                }
                valid = valid_flag[0] && valid_flag[1] && valid_flag[2] && valid_flag[3];
                console.log(valid);
                return valid;

            }else{
                $("#signupalert").html("* marked field can't be empty");
                $("#signupalert").show();
                return false;
            }
        },
        setCookie:function(name,value,days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days*24*60*60*1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        },
        getCookie:function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        },
        eraseCookie:function(name) {
            document.cookie = name+'=; Max-Age=-99999999;';
        }

    }
}();



$("#login-username").on('click',function(){
    if($("#login-alert").length>0){
        $("#login-alert").hide();
    }
});
$("#login-password").on('click',function(){
    if($("#login-alert").length>0){
        $("#login-alert").hide();
    }
});

$("#signupform .form-control").on('click',function(){
    if($("#signupalert").length > 0){
        $("#signupalert").hide();
    }
});
