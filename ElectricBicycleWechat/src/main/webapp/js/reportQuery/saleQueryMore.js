/**
 * 销售信息更多查询
 */
//var url = baseurl + "/initialAccount/insertAccount";
/**
 * 页面加载函数
 */
$(function(){
	
	//获取当前登录用户信息
	getCurrentUser();
	
	$("#search").click(function(){
		searchPCInfo();
	});
});

/**
 * 获取当前登录用户信息
 */
function getCurrentUser(){
	var data = "";
	var url = baseurl + "/login/getCurrentUser";
	sendRequest("post", url, data, getGetCurrentUserResult);
	return false;
};

/**
 * 获取当前登录用户信息的返回结果
 * @param result
 * @returns {Boolean}
 */
function getGetCurrentUserResult(result){
	var data = eval("(" + result + ")");
	if(data.name=='' || data.name==null || data.currentAccount==null){
		window.location.href = baseurl + "/views/login/login.html";
	}else{
		$("input[name='currentUser']").val(data.name);
		var accountType = data.currentAccount.type;//账号类型
		if(accountType == '4'){
			$("#areaManager").show();
		}else if(accountType == '1'){
			$("#sellerAccount").hide();
		}else if(accountType == '2'){
			$("#area").show();
		}
		if(accountType == '2' || accountType == '4'){
			//获取经销商账号
			getSellerInfo();
		}
		if(accountType == '2'){
			//获取区域信息
			getAreaInfo();
		}
		
		//页面加载时查询销售信息
		searchPCInfo();
	}
	return false;
}

/**
 * 获取经销商账号
 */
function getSellerInfo(){
	var data = "";
	var url = baseurl + "/balanceQuery/getSellerInfo";
	sendRequest("post", url, data, getSellerInfoResult);
	return false;
};

/**
 * 获取经销商账号的返回结果
 * @param result
 * @returns {Boolean}
 */
function getSellerInfoResult(result){
	var data = eval("(" + result + ")");
	if(data==false){
		$("#msgContent").text("查询经销商账号失败！");
		$("#iosDialog2").show();
	}else{
		for(var i=0;i<data.seller.length;i++){
			var select = $("select[name='sellerCode']");
			var option = "<option value="+data.seller[i].sellerCode+">"+data.seller[i].sellerName+"</option>";
			select.append(option);
		}
	}
	return false;
}

/**
 * 获取区域信息
 */
function getAreaInfo(){
	var data = "";
	var url = baseurl + "/balanceQuery/getAreaInfo";
	sendRequest("post", url, data, getAreaInfoResult);
	return false;
};

/**
 * 获取区域信息的返回结果
 * @param result
 * @returns {Boolean}
 */
function getAreaInfoResult(result){
	var data = eval("(" + result + ")");
	if(data==false){
		$("#msgContent").text("查询区域信息失败！");
		$("#iosDialog2").show();
	}else{
		for(var i=0;i<data.area.length;i++){
			var select = $("select[name='area']");
			var option = "<option value="+data.area[i].areaCode+">"+data.area[i].areaName+"</option>";
			select.append(option);
		}
	}
	return false;
}

/**
 * 查询销售信息
 */
function searchPCInfo(){
	var sellerCode = $("select[name='sellerCode']").val();
	var areaManagerCode = $("input[name='managerCode']").val();
	var areaCode = $("select[name='area']").val();
	var materialName = $("input[name='materialName']").val();
	var startDate = $("input[name='startDate']").val();
	var endDate = $("input[name='endDate']").val();
	var data = "areaCode="+areaCode+"&sellerCode="+sellerCode+"&areaManagerCode="+areaManagerCode+"&materialName="+materialName+"&startDate="+startDate+"&endDate="+endDate;
	var url = baseurl + "/saleQuery/searchPCInfo";
	sendRequest("post", url, data, getSearchPCInfoResult);
	return false;
};
/**
 * 查询销售信息请求的返回结果
 * @param result
 * @returns {Boolean}
 */
function getSearchPCInfoResult(result){
	var data = eval("(" + result + ")");
	$("#showDiv").empty();
	if(data!=''){
		/*var accountType = data.accountType;
		if(accountType == '4'){
			$("#areaManager").show();
		}else if(accountType == '1'){
			$("#sellerAccount").hide();
		}*/
		var div = $("#showDiv");
		for(var i=0;i<data.saleList.length;i++){
			 var html = "<tr style='border-bottom: 1px solid #e5e5e5;text-align:center;'><td >"+(i+1)+"</td>"+
                 		"<td id='sellerCode' style='display:none;' >"+data.saleList[i].sellerCode+"</td>"+
                 		"<td id='barCode' style='display:none;'>"+data.saleList[i].barCode+"</td>"+
                 		"<td id='materialName' >"+data.saleList[i].materialName+"</td>"+
                 		"<td id='frameCode' >"+data.saleList[i].frameCode+"</td>"+
                 		/*"<tr><td>车架号：</td><td>"+data.saleList[i].frameCode+"</td></tr>"+*/
                 		/*"<td>"+data.saleList[i].sellDate+"</td>"+*/
                 		"<td><div onclick='saleQueryDetail(this);' style='color:blue;'>详情</div></td></tr>";
			 div.append(html);
		}
	}
}


/**
 * 查看销售详情
 * @param obj
 */
function saleQueryDetail(obj){
	var sellerCode = $.trim($(obj).parent().parent().find("#sellerCode").text());
	var barCode = $.trim($(obj).parent().parent().find("#barCode").text());
	var data = "sellerCode="+sellerCode+"&barCode="+barCode;
	var url = baseurl + "/views/reportQuery/saleQueryDetail.html";
	window.location.href = url+"?"+data;
}


/**
 * 关闭弹出框
 */
function closeDialog2(){
	$('#iosDialog2').fadeOut(200);
}

