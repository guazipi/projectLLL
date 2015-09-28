
//$('#dropdownMenu4').click(function(){
//	//document.getElementById('lllllll').style.display="block";
//})

$('#logIn').click(function(){
	var e=$.trim($('#exampleInputEmail2').val()),
	    p=$.trim($('#exampleInputPassword2').val());
	$.post('/login',
	{
		email:e,
		pwd:p
	},function(data,status){
		if(status =='success'){
			if(data!='failed'){
				document.getElementById('dropdownMenu4').innerHTML= data;
				document.getElementById('lllllll').style.display="none";
			}else{
				alert('登陆失败，换个邮箱试试！');
			}
		}else{
			alert('无法连接到服务器!');
		}
	});
});

$('#reg').click(function(){
    var nick = $.trim($('#username').val()),
	    password=$.trim($('#ipassword').val()),
		em=$.trim($('#iemail').val()),
		selfpre=$.trim($('#imessage').val());
	if(em=='' || password==''){
		alert('邮箱和用户名不能为空');
		return;
	} 
	
	$.post('/register',
	{
		name:nick,
		pwd:password,
		email:em,
		selfDisc:selfpre
	},function(data,status){
		if(status =='success'){
			if(data=='success'){
				alert('恭喜，注册成功');
			}else{
				alert('不好意思，注册失败');
			}	
		}else{
			alert("无法连接到服务器！");
		}
	});
});