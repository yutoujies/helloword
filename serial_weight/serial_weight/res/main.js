requirejs.config({
  appDir: ".",
  baseUrl: "res/vendor/js",
});

requirejs(["jquery.min", 'bootstrap.min'], function(jQuery, Bootstrap) {
  "use strict";
  
  var hasDev = false;
  var connId = false;
  $("nav input[name=disconnect]").hide();
  $("nav input[name=connect]").prop("disabled", true);
  
  //$("nav input[name=weight]").on('click', function() {
	//  $.ajax({
      //      type: "get",
        //    url: "http://192.168.8.154:8060/turkey-api/applicationVersion",
          //  success: function(data){
            //    var jsonDatas = JSON.parse(JSON.stringify(data));
				//var env = jsonDatas.env;
				//$("nav input[name=weight]").val(jsonDatas);
                //$("nav input[name=weight2]").val(env);
            //}
        //})
  //})
  
  
  //输出获取的重量数据
  function output_text(bufview){
	  var rWeight = "";
    $.each(bufview, function(i, data) {
        var value = "0x";
        if (data <= 15) {
          value += "0" + data.toString(16).toUpperCase();
        } else {
          value += data.toString(16).toUpperCase();
        }
		rWeight += value + " ";
    });
	 $("input[name=rWeight]").prop("disabled", false);
	 $("input[name=rWeight]").val(String.fromCharCode.apply(String, bufview));
	 $("input[name=rWeight]").prop("disabled", true);
  }
  
  //获取端口号
  chrome.serial.getDevices(function(devices) {
    $.each(devices, function(i, dev) {
      hasDev = true;
      $("nav select[name=portNumber]").append($(
        "<option/>").html(dev.path).val(dev.path));
    });
    $("nav input[name=connect]").prop("disabled", !hasDev);
  })
  
  //断开连接
  $("nav input[name=disconnect]").on('click', function() {
    if (connId) {
      chrome.serial.disconnect(connId, function() {
        $('#showTip').html("断开连接成功");
        $("nav input[name=connect]").prop("disabled", !hasDev);
        $("nav input[name=disconnect]").hide();
        $("nav input[name=connect]").show();
        connId = false;
      });
    }
  });

  //连接串口
  $("nav input[name=connect]").on('click', function() {
	$("#hideTr").prop("hidden", false);
    chrome.serial.connect($(
        "nav select[name=portNumber]").val(), {
        'bitrate': parseInt($(
          "nav select[name=baudRate]").val())
      },
      function(connInfo) {
        $("nav input[name=connect]").prop("disabled",
          true);
        $("nav input[name=connect]").hide();
        $("nav input[name=disconnect]").show();
        $('#showTip').html("连接成功");
        connId = connInfo.connectionId;
      });
  });
	
  //获取数据
  chrome.serial.onReceive.addListener(function(stream) {
    var bufView = new Uint8Array(stream.data);
    output_text(bufView)
  });
});