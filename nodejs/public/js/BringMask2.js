$(updateDB);
$(getState);
$(update);


var value = "";
var condition = "";
var text = "";
function update(){
    setInterval(function(){
        this.getState();
    },2000);

    
    setInterval(function(){
        this.updateDB();
    },60000*20);
}
function updateDB(){
    $.ajax({
        url : '/getData',
        dataType : 'json',
        type : 'GET',
        data : {'msg' : 'help'},
        success : function(){
            console.log('update db');
        }
    });
}
function getState(){
    $.ajax({
        url : '/postDB',
        dataType : 'json',
        type : 'GET',
        data : {'msg' : 'help'},
        success : function(result){
        
           //console.log(result[0].condition);
           
            var value = result[0].value;
            var condition = result[0].condition;
            var state = result[0].state;
                
            console.log('change');
           
                $("#show_value").empty();
                $("#notifier").empty();
                //평소
                if(state == 0){
                    $("#notifier").append("좋은 하루 보내세요");
                }
                //접근
                else{
                //좋음

                    if(condition == 0){
                        $("#show_value").append("미세먼지 : 좋음");
                        $("#notifier").append("날씨가 맑습니다.<br>오늘은 마스크가 필요 없겠네요!");
                
                    }
                    else{
                        $("#show_value").append("미세먼지 : 나쁨");
                        $("#notifier").append("미세먼지 농도가 높습니다.<br>마스크를 챙겨 주세요!");
                    }

                }
            
        }
    });
}
