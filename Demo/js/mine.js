var mineMap = function( map , x , y , mineNumber ) {

	var buildRows =function(i) { return "<li data-row=\"" + i + "\"></li>"; },
        buildCell =function(i) { return "<span data-cell=\"" + i + "\"><p></p></span>";},
        mineCell = function(i,j) {return $("[data-row=" + j + "]").children("[data-cell=" + i + "]")},
        IS_FINISHED = false,
        notShownNumber = x*y,
        flagCounter = 0,
        correctFlag = 0,
        mapData= function(x,y,mineNumber){
		this.X = x;
		this.Y = y;
		this.mineNumber=mineNumber;
	},
        areaHeight = $('.mapplace').height() / 1.3;

    // Reset The Timer
    GAME_RUNNING = false;
    timerReset();

    // Define Win Function
    var win = function() {
        // Set gmae state tu finished.
        IS_FINISHED = true;
        GAME_RUNNING = false;
        timerPause();
        alert("Yesssss! You Win!!!!!");
    }

    // Define Lose Function
    var lose = function() {
        // Set gmae state tu finished.
        IS_FINISHED = true;
        GAME_RUNNING = false;
        timerPause();

        // Check for correct or wrong flags
        checkFlag();

        alert("NAN NA NANA NA! You Lose :D !!!!!");
    }


        mineArea = new Array(x);
        for ( var i =0; i< x; i++) {
            mineArea[i] = new Array(y);
        }



    // Building The Map

    $(map).html("");
	for(var i = 0; i < y ; i++ ){
		$(map).append(buildRows(i));
	}

    for(var j =0; j < x; j++) {
        $(map).children('li').append(buildCell(j));
    }
    if(x > y){
        $('span').css({'width':areaHeight/x,'line-height':areaHeight/x +'px','height':areaHeight/x});
    }else{
        $('span').css({'width':areaHeight/y,'line-height':areaHeight/y +'px','height':areaHeight/y});
    }


    var count = 0;
    while( count < mineNumber ) {

        var randX = Math.floor( Math.random() * x ),
            randY = Math.floor( Math.random() * y );
            if ( mineArea[randX][randY] != -1 ) {
                mineArea[randX][randY] = -1;
                count++;
            }

    }

    // counting the numbers of mine beside a cell.
    for ( var i =0 ; i < x; i++)  {
        for(var j=0; j < y; j++) {

            if(mineArea[i][j] == -1) continue;
            mineArea[i][j] = 0;
            var sum =0;

            for(var ii = i-1; ii <= i+1 ; ii++) {
                for (var jj = j-1; jj <= j + 1; jj++) {
                    if(ii>=0 && jj>=0 && ii<x && jj<y){
                        if(mineArea[ii][jj]==-1){
                            sum++;
                        }
                    }
                }
            }

            mineArea[i][j] = sum;
        }
    }

    // Define Click Function
    var spanClick = function(clicked) {
        if( IS_FINISHED ) return;
        if ( $(clicked).hasClass('flag') ) return;
        if ( !GAME_RUNNING ) GAME_RUNNING = true;
        var spanRow = $(clicked).parent("li").data("row"),
            spanCell = $(clicked).data("cell");

            if( mineArea[spanCell][spanRow] == -1 ) {
                $(clicked).addClass("mineFired");
                for ( var i =0 ; i < x; i++)  {
                    for(var j=0; j < y; j++) {
                        if( mineArea[i][j] == -1 ) {
                            $(mineCell(i,j)).addClass("mineShow");
                        }
                    }
                }
                lose();
            }

            else if( !( $(clicked).hasClass("Show")) ) {
                $(clicked).addClass('Show');
                notShownNumber--;

                $(clicked).children("p").text( mineArea[spanCell][spanRow]==0 ? " " : mineArea[spanCell][spanRow]);

                if(mineArea[spanCell][spanRow]==0 ){
                    for(var i = spanCell-1; i <= spanCell+1 ; i++) {
                        for (var j = spanRow -1; j <= spanRow + 1; j++) {
                            if(i>=0 && j>=0 && i<x && j<y){
                                spanClick($(mineCell(i,j)))
                            }
                        }
                    }
                }
            }
            if ( $('.Show').length + mineNumber == x*y || notShownNumber==mineNumber) {
	      if( IS_FINISHED ) return;
	      win();
	      return; 
	    }

    }

    // Define Flag Function
    var spanFlag = function(clicked) {
        if( IS_FINISHED ) return;
        var spanRow = $(clicked).parent("li").data("row"),
            spanCell = $(clicked).data("cell");

        if ($(clicked).hasClass("Show") ) return;

        if( $(clicked).hasClass("flag")) {
           $(clicked).removeClass('flag');
            flagCounter --;
            if( mineArea[spanCell][spanRow] == -1 ) {
                correctFlag--;
            }

            if ( correctFlag == flagCounter && flagCounter == mineNumber ) {
                win();
            }

            return;
        }

       $(clicked).addClass('flag');

        flagCounter ++;

        if( mineArea[spanCell][spanRow] == -1 ) {
            correctFlag++;
        }

        if ( correctFlag == flagCounter && flagCounter == mineNumber ) {
            win();
        }

    }

    var checkFlag = function() {
        $('.flag').each(function() {
            var spanRow = $(this).parent("li").data("row"),
            spanCell = $(this).data("cell");

            if( mineArea[spanCell][spanRow] == -1 ) {
                $(this).addClass('correct-flag');
            }

            else {
                $(this).addClass('wrong-flag');
            }

        });
    }

    // Fire Click Functions
    $(map).children("li").children("span").mousedown(function(e){
        if( e.button == 2 || e.button == 3 ) {
            spanFlag($(this));
        }
        else {
            spanClick($(this));
        }
    });

    verticalAlign(y);
    return new mapData(x,y,mineNumber);

}